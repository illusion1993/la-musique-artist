var artistModel = require('./models');
var utils = require('./utils');

module.exports.build_search_index = function (req, res) {
    artistModel.build_search_index(req.query.batch_size);
    res.send('Building Artist Search Index');
};

module.exports.artists_list = function (req, res) {
    artistModel.artists_list(utils.give_response(res), utils.get_page_number(req), utils.get_limit(req));
};

module.exports.search = function (req, res) {
    artistModel.search(utils.give_response(res), req.query.keyword, utils.get_page_number(req), utils.get_limit(req));
};