/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-07-13.
 */

module.exports = {
    init: function(req, res) {
        res.render('change/index', {username: req.session.username});
    }
}
