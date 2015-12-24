var express = require('express');
var router  = express.Router();
var os      = require('os');

/*GET monitor info */
router.get('/monitor', function(req, res) {
    var upseconds = os.uptime();
    var loadAvg = os.loadavg()[0]; //the 1 min load avg
    var hostname = os.hostname();
    var data = {
        "hostname": hostname,
        "uptime": upseconds,
        "loadAvg": loadAvg
    };
    console.log("upseconds is:" + upseconds);
    res.json(data);    

});

module.exports = router;
