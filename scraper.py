import eventlet
from eventlet.green import urllib2
from bs4 import BeautifulSoup
import urllib
from collections import namedtuple
import re
import pymongo
import pprint

SKIP_REQUESTS = True

def fetch(url):
    body = urllib2.urlopen(url).read()
    return url, body

def get_mlh_hackathon_seasons():
    # s = ["f", "s"]
    # years = range(2013, 2017)
    # seasons = [i+str(year) for year in years for i in s]
    # seasons.remove("s2013") #no s2013 season
    return ['f2013', 'f2014', 's2014', 'f2015', 's2015', 's2016']

def get_mlh_hackathon_names():
    ret_val = set()
    seasons = get_mlh_hackathon_seasons()
    urls = ["https://mlh.io/seasons/{}/events".format(season) for season in seasons]
    pool = eventlet.GreenPool(2)
    for url, body in pool.imap(fetch, urls):
        soup = BeautifulSoup(body, 'html.parser')
        events = soup.findAll("div", { "class" : "event" })
        for event in events:
            ret_val.add(event.find("h3").text.strip())

    ret_val.remove("PennApps X") #removing because it's the one duplicate/inconsistency
    return ret_val

class DevPostScraper:
    pool = eventlet.GreenPool(10)
    def __init__(self, hackathon_names):
        self.hackathon_names = hackathon_names
        self.mongo_client = pymongo.MongoClient()
        self.hackathon_project_collection = self.mongo_client.swamphacks.projects
        compound_index = [
            ("hackathon",           pymongo.ASCENDING),
            ("project_name",        pymongo.ASCENDING)
        ]
        indexes = [
            ("group_members",       pymongo.ASCENDING),
            ("tags",                pymongo.ASCENDING),
            ("likes",               pymongo.ASCENDING),
            ("awards",              pymongo.ASCENDING)
        ]

        self.hackathon_project_collection.create_index(compound_index)
        for index in indexes:
            self.hackathon_project_collection.create_index([index])

    def run(self):
        hackathon_devpost_links = dev_post_scraper.get_hackathon_devpost_links()
        self.get_devpost_project_info(hackathon_devpost_links)
        pass

    def get_hackathon_devpost_links(self):
        search_urls = []
        ret_val = []
        H_URL = namedtuple("H_URL", ["name", "url"])

        def remove_non_mlh_hackathons(hackathons):
            #TODO: remove non mlh hackathons!
            return
            # for h_name in hackathons:
            #     print len(hackathons)
            #     for h_name in hackathons:
            #         if h_name in self.hackathon_names:

        for name in self.hackathon_names:
            query = {"search": name}
            search_url = "http://devpost.com/hackathons?utf8=%E2%9C%93&{}&challenge_type=all&sort_by=Recently+Added".format(urllib.urlencode(query))
            search_urls.append(search_url)

        for url, body in self.pool.imap(fetch, search_urls):
            soup = BeautifulSoup(body, 'html.parser')
            hackathon_tiles = soup.findAll("a", {"class": "clearfix"})
            for hackathon_tile in hackathon_tiles:
                hackathon_link = hackathon_tile["href"].split("com")[0] + "com/submissions" #skip main hackathon page and go to submissions
                hackathon_name = hackathon_tile.find("h2").text.strip()
                h_url = H_URL(hackathon_name, hackathon_link)
                ret_val.append(h_url)

        return ret_val

    def get_devpost_project_info(self, hackathon_devpost_h_urls):
        begin_username_index = len("http://devpost.com/")

        def project_links_generator(hackathon_devpost_h_urls):
            for hackathon_devpost_h_url in hackathon_devpost_h_urls:
                print hackathon_devpost_h_url
                body = urllib.urlopen(hackathon_devpost_h_url.url)
                soup = BeautifulSoup(body, 'html.parser')
                project_tiles = soup.findAll("div", {"class": "gallery-item"})
                for project_tile in project_tiles:
                    yield project_tile.find("a")["href"]

        plg = project_links_generator(hackathon_devpost_h_urls)
        for url, body in self.pool.imap(fetch, plg):
            print url
            soup = BeautifulSoup(body, 'html.parser')

            project_name = soup.find("h1").text.strip()
            try:
                hackathon = soup.find("div", {"class": "software-list-content"}).find("a")["href"].replace("http://", "")
                hackathon = re.sub(".devpost.com.*", "", hackathon).strip()
            except:
                hackathon = url.replace("http://", "")
                hackathon = hackathon[:hackathon.index(".devpost")]
            tags = []
            group_members = set()
            other_urls = []
            first_github_url = None
            awards = []

            for i in soup.findAll("a", {"class": "user-profile-link"}):
                group_members.add(i["href"][begin_username_index:])

            for i in soup.findAll("span", {"class": "cp-tag"}):
                tags.append(i.text)

            software_urls = soup.find("ul", {"data-role": "software-urls"})
            if software_urls:
                for link_element in software_urls.findAll("li"):
                    link = link_element.find("a")["href"].strip()
                    if not first_github_url and "github" in link:
                        first_github_url = link
                    else:
                        other_urls.append(link)

            likes_element = soup.find("span", {"class": "side-count"})
            likes = int(likes_element.text.strip()) if likes_element else 0

            awards_elements = soup.findAll("span", {"class": "winner"})
            if awards_elements:
                for i in awards_elements:
                    awards.append(i.parent.text.replace("Winner", "").strip())

            insert_dict = {
                "project_name": project_name,
                "hackathon": hackathon,
                "tags": tags,
                "group_members": [i for i in group_members],
                "other_urls": other_urls,
                "github": first_github_url,
                "likes": likes,
                "awards": awards
            }

            self.hackathon_project_collection.insert(insert_dict)

hackathon_names = get_mlh_hackathon_names()
dev_post_scraper = DevPostScraper(hackathon_names)
dev_post_scraper.run()