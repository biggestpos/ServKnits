var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('knitdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'knitdb' database");
        db.collection('knits', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'knits' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving knit: ' + id);
    db.collection('knits', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('knits', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addKnit = function(req, res) {
    var knit = req.body;
    console.log('Adding knit: ' + JSON.stringify(knit));
    db.collection('knits', function(err, collection) {
        collection.insert(knit, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateKnit = function(req, res) {
    var id = req.params.id;
    var knit = req.body;
    console.log('Updating knit: ' + id);
    console.log(JSON.stringify(knit));
    db.collection('knits', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, knit, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating knit: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(knit);
            }
        });
    });
}
 
exports.deleteKnit = function(req, res) {
    var id = req.params.id;
    console.log('Deleting knit: ' + id);
    db.collection('knits', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var knits = [
    {
        name: "Sweater",
        description: "Some info about the pattern",
        picture: "sweater.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];
 
    db.collection('knits', function(err, collection) {
        collection.insert(knits, {safe:true}, function(err, result) {});
    });
 
};
