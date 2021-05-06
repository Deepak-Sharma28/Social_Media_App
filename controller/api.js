module.exports = (Router) => {

    Router.get('/', (req, res) => {
        res.send("server is working")
    });

};