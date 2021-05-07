module.exports = (Router, collection, ProfileModel, Isverify) => {
    //endpoint for the current user's profile

    Router.get('/me', Isverify, async(req, res) => {
        try {
            const profile = await ProfileModel.findOne({ user: req.user.id })

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });


};