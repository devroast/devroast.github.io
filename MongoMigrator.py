from pymongo import MongoClient
from scraper import DevPostScraper
import urllib
from bs4 import BeautifulSoup
from collections import defaultdict

class MongoMigrator:
    def __init__(self):
        self.client = MongoClient("162.243.11.239")
        self.database = self.client.swamphacks_v2

        self.projects_collection = self.database.projects
        self.user_collection = self.database.users

    def migrate_commits_to_users_collection(self):

        filter = {"github": {"$exists": True}, "github_activity": {"$exists": True}}
        projection = {
            "_id": 0,
            "project_name": 1,
            "hackathon": 1,
            "group_members": 1,
            "github_activity": 1
        }

        for result in self.projects_collection.find(filter, projection):
            group_members = result["group_members"]
            for group_member in group_members:

                github_link = DevPostScraper.get_github_link_from_devpost_id(group_member)
                query = {"devpost_id": group_member}
                update = {}
                inc_dict = {}
                if len(group_members) > 1:
                    for teammate in [i for i in group_members if i != group_member]:
                        inc_dict["teammates."+group_member] = 1

                name = None
                if github_link:
                    body = urllib.urlopen(github_link)
                    soup = BeautifulSoup(body, 'html.parser')
                    name_element = soup.find("span", {"class": "vcard-fullname"})
                    if name_element:
                        name = name_element.text.strip()

                commit_frequency = defaultdict(int)
                increment_dict = {}

                if name:
                    if "github_activity" in result:
                        for i in result["github_activity"]:
                            if i["committer"] == name:
                                commit_frequency[i["delta_hours"]] += 1

                    hackathon_commit_freq = [key for key in commit_frequency]

                    for k,v in commit_frequency.items():
                        increment_dict["commit_times." + str(k)] = v
                    for k in hackathon_commit_freq:
                        increment_dict["divide_commit_times_by_this." + str(k)] = 1

                update["$addToSet"] = {"projects": result["project_name"], "hackathons": result["hackathon"]}
                if increment_dict:
                    update["$inc"] = increment_dict

                self.user_collection.update_one(query, update, upsert=True)

    def migrate_time_delta(self):
        for document in self.projects_collection.find({"github_activity": {"$ne": None}}):
            first_commit_date = None
            for i in document["github_activity"]:
                if not first_commit_date or first_commit_date > i["delta_hours"]:
                    first_commit_date = i["delta_hours"]
            update = {}
            for i in document["github_activity"]:

                query = {"_id": document["_id"], "github_activity.delta_hours": i["delta_hours"]}
                update = {
                    "$set": {
                        "github_activity.$.delta_hours": int((i["delta_hours"] - first_commit_date).total_seconds()/3600),
                        "github_activity.$.time": i["delta_hours"]
                    }
                }
                print self.projects_collection.update(query, update)

mongo_migrator = MongoMigrator()
mongo_migrator.migrate_time_delta()
# mongo_migrator.migrate_commits_to_users_collection()