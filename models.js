var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var searchico = require('./searchico');

function getMongoURI(databaseName) {
    var mongoUser = encodeURIComponent(process.env.MONGO_USER);
    var mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
    var mongoPort = encodeURIComponent(process.env.MONGO_PORT);
    return 'mongodb://' + mongoUser + ':' + mongoPassword + '@127.0.0.1:' + mongoPort + '/' + databaseName + '?authSource=' + 'admin';
}

var dbConnection = mongoose.createConnection(getMongoURI('discogs'));

var artistSchema = mongoose.Schema({
	name: { type: String },
	realname: { type: String },
});
artistSchema.plugin(mongoosePaginate);

var artistModel = dbConnection.model('artists', artistSchema);
module.exports = artistModel;


// Returns pagination object for given page number and pagination size
function get_artists_list (callback, page_number, pagination_size) {
    artistModel.paginate({}, { page: page_number, limit: pagination_size }, function(err, artists) {
        callback(artists);
    });
}
module.exports.artists_list = get_artists_list;


var search_box, built = false, pages_inserted = 0, total_pages = 1, batch_size = 50, total_rows = 0;
// Brings next page of objects, then inserts them into search
function insert_next_page () {
    if (pages_inserted === total_pages) {
        console.log('\n**Built Artist Search Index**');
        built = true;
        return;
    }

    artistModel.paginate({}, { select: 'name realname', page: pages_inserted + 1, limit: batch_size }, function(err, artists_page) {
        var artists = JSON.parse(JSON.stringify(artists_page.docs));
        search_box.add(artists);
        pages_inserted++;
        total_pages = parseInt(artists_page.pages);
        artists_page = undefined;
        total_rows += batch_size;

        console.log('Inserted ' + batch_size + ' more rows, total inserted: ' + total_rows);

        insert_next_page();
    });
}

module.exports.build_search_index = function (requested_batch_size) {
    if (built) return;
    search_box = searchico({ 
    	deep: false, 
    	keys: ['name', 'realname'],
    	index_key: '_id' 
    });
    if (requested_batch_size && parseInt(requested_batch_size) > 0) 
        batch_size = parseInt(requested_batch_size);
    insert_next_page();
};
 
function get_artists_from_ids (callback, ids, page_number, pagination_size) {
    artistModel.paginate({ _id: { $in: ids } }, { page: page_number, limit: pagination_size}, function(err, s) {
        if (err) console.log(err);
        callback(s);
    });
}

module.exports.search = function (callback, keyword, page_number, pagination_size) {
    var result_ids;
    if (keyword && keyword.length && keyword.trim().length) {
        result_ids = search_box.find(keyword);
    }
    get_artists_from_ids(callback, result_ids, page_number, pagination_size);
};