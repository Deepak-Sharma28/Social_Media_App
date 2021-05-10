const { check, validationResult } = require('express-validator');

module.exports = (Router, collection, ProfileModel, Isverify) => {
    //endpoint for the current user's profile

    Router.get('/me', Isverify, async(req, res) => {
        try {
            const profile = await ProfileModel.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
            console.log(profile);
            if (!profile) {
                res.status(400).json({ msg: "There is no profile for this user" });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });




    //for creating a user profile
    console.log("working");
    Router.post('/profile', [Isverify, [check('status', 'status is required').not().isEmpty(),
        check('skills', 'skills are required').not().isEmpty()
    ]], async(req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }


        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;


        //build a profile field object

        const profileFields = {};
        profileFields.user = req.user.id;

        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (youtube) profileFields.youtube = youtube;
        if (facebook) profileFields.facebook = facebook;
        if (twitter) profileFields.twitter = twitter;
        if (instagram) profileFields.instagram = instagram;
        if (linkedin) profileFields.linkedin = linkedin;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        console.log(profileFields.skills);

        //build a social object

        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await ProfileModel.findOne({ user: req.user.id });
            // console.log(profile);
            // console.log(req.user.id);

            if (profile) {
                //update

                profile = await ProfileModel.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
                // console.log(profile);
                console.log("update");
                return res.json(profile);
            }
            //create

            profile = new ProfileModel(profileFields);

            await profile.save();
            console.log("create");
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).json('Server Error');
        }
    });


};