var mongoose = require('mongoose');

function getMongoURI(databaseName) {
    var mongoUser = encodeURIComponent(process.env.MONGO_USER);
    var mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
    var mongoPort = encodeURIComponent(process.env.MONGO_PORT);
    return 'mongodb://' + mongoUser + ':' + mongoPassword + '@127.0.0.1:' + mongoPort + '/' + databaseName + '?authSource=' + 'admin';
}

var dbConnection = mongoose.createConnection(getMongoURI('discogs'));

// Schema for 'artists' collection in 'discogs' db
var artistSchema = mongoose.Schema({
	name: { type: String },
});

// Model for 'artists' collection in 'discogs' db
artistModel = dbConnection.model('artists', artistSchema);

module.exports = artistModel;

module.exports.get_all_artists = function (callback) {
    artistModel.find(function (err, artists) {
        callback(err, artists);
    });
};
