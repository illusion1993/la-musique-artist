var artistModel = require('./models');
var searchico = require('searchico');

var search_box, built = false;

module.exports.build_search_index = function (req, res) {
    artistModel.get_all_artists(function (err, artists) {
        if (err)
            console.log(err);
        else {
            if (!built) {
                artists = JSON.parse(JSON.stringify(artists));
                search_box = searchico(artists, { deep: true, keys: ['name', 'realname', 'members'] });
                console.log('\n**Built Artist Search Index**');
            }
            res.send('Building Artist Search Index');
            built = true;
        }
    });
};

module.exports.artists_list = function (req, res) {
    artistModel.get_all_artists(function (err, artists) {
        if (err)
            console.log(err);
        else
            res.json(artists);
    });
};

module.exports.search = function (req, res) {
    if (req.query && req.query.keyword && req.query.keyword.trim()) {
        res.json(search_box.find(req.query.keyword));
    }
    else res.json([]);
};
