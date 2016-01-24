import pymongo
from eventlet.green import urllib2
import eventlet
from bs4 import BeautifulSoup
import json
import requests
import datetime, dateutil.parser
import time

from secrets import *

class GithubCommitGrabber:
    def __init__(self):
        self.mongo_client = pymongo.MongoClient()
        self.hackathon_project_collection = self.mongo_client.swamphacks_v2.projects
        index = [
            ("github_activity.delta_hours",        pymongo.ASCENDING)
        ]

        self.hackathon_project_collection.create_index(index)

    def stall_until_credits_refresh(self):
        r = requests.get("https://api.github.com/rate_limit?access_token={}".format(GITHUB_API_KEY))
        response = json.loads(r.text)
        rate_remaining = response["rate"]["remaining"]
        if rate_remaining < 100:
            time.sleep(5 * 60)
            return self.stall_until_credits_refresh()
        else:
            return rate_remaining

    def get_commits(self):
        def github_link_generator():

            filter = {"github": {"$ne": None}, "github_activity": {"$exists": False}}
            projection = {
                "_id": 0,
                "project_name": 1,
                "hackathon": 1,
                "github": 1
            }
            for result in self.hackathon_project_collection.find(filter, projection):
                yield result

        glgs = github_link_generator()
        for glg in glgs:
            username, repo_name = [i for i in glg["github"].split("/") if len(i) > 0][-2:]
            i = 1
            commits = []
            commit_document = []
            first_commit_date = None

            while (True):
                url = 'https://api.github.com/repos/{}/{}/commits?page={}&access_token={}'.format(username, repo_name, str(i), GITHUB_API_KEY)
                print self.stall_until_credits_refresh(), len(commit_document)
                if len(commit_document) > 1500:
		    print url, glg
                    raw_input("UHHHHH")
                r = requests.get(url)
                if r.status_code == 404:
                    break
                json_response = json.loads(r.text)
		if "message" in json_response and json_response["message"] in ["Git Repository is empty.", "Repository access blocked"]:
		    break
                if len(json_response) == 0:
                    break
                commits += json_response
                i += 1
                for c in commits:
                    committer_field = c["commit"]["committer"]
                    date = dateutil.parser.parse(committer_field["date"])

                    sub_document = {
                        "time": date, #int(round(td.total_seconds()/3600)),
                        "committer": committer_field["name"],
                        "message": c["commit"]["message"]
                    }
                    commit_document.append(sub_document)

                if not commits[-1]["parents"]:
                    break

            if len(commits) > 0:
                first_commit_date = min([c["time"] for c in commit_document])

                commit_document = [i for i in reversed(commit_document)]
                for i in commit_document:
                    i["delta_hours"] = int((i["time"] - first_commit_date).total_seconds()/3600)

            query = {
                "project_name": glg["project_name"],
                "hackathon": glg["hackathon"]
            }
            update = {
                "$set": {
                    "github_activity": commit_document
                }
            }

            self.hackathon_project_collection.update_one(query, update)
github_scraper = GithubCommitGrabber()
github_scraper.get_commits()
