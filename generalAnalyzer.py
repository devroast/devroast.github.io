import pymongo
from pymongo import MongoClient
from bson.code import Code

client = MongoClient('162.243.11.239', 27017)
db = client.swamphacks
projects = db.projects

mapper = Code("""
               function () {
               	 if (this.github_activity) {
                   this.github_activity.forEach(function(z) {
                   	 days = Math.floor(z.delta_hours / 24);
	                   	emit(days, 1);                   	 
                   });
                 }
               }
               """)

reducer = Code("""
                function (key, values) {
                  var total = 0;
                  for (var i = 0; i < values.length; i++) {
                    total += values[i];
                  }
                  return total;
                }
                """)               

result = projects.map_reduce(mapper, reducer, "myresults")

for doc in result.find():
     print str(doc['_id']) + '	' + str(doc['value'])