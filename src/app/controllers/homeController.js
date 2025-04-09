
const renderHome = (req, res) => {
    res.render('home', { session: req.session });
};

module.exports = { renderHome };
