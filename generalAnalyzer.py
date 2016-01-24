import pymongo
from pymongo import MongoClient
from bson.code import Code

client = MongoClient('162.243.11.239', 27017)
db = client.swamphacks_v2
projects = db.projects

mapper = Code("""
    function () {
        if (this.github_activity) {
            var project_day = {};
            this.github_activity.forEach(function(z) {
                var day = Math.floor(z.delta_hours / 24);
                if (!(day in project_day)) {
                    project_day[day] = 0;
                }
                project_day[day]++;
            });
            this.github_activity.forEach(function(z) {
                var day = Math.floor(z.delta_hours / 24);
                emit(day, 1/project_day[day]);
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

result = projects.map_reduce(mapper, reducer, "overall_day_vs_git")
