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



        //build a social object

        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await ProfileModel.findOne({ user: req.user.id });


            if (profile) {
                //update

                profile = await ProfileModel.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });

                return res.json(profile);
            }
            //create

            profile = new ProfileModel(profileFields);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).json('Server Error');
        }
    });



    //Endpoint for getting all user profiles


    Router.get('/allProfile', async(req, res) => {
        try {
            const Profiles = await ProfileModel.find().populate('user', ['name', 'avatar']);
            res.json(Profiles);

        } catch (err) {
            console.error(err.message);
            res.status(500).json("server error");
        }
    });


    //Endpoint for getting user profile by Id

    Router.get('/profile/:user_id', async(req, res) => {
        try {
            const profile = await ProfileModel.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
            if (!profile) { return res.status(400).json("profile is not found"); }
            res.json(profile);
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(400).json("Profile is not found");
            }
            res.status(500).json("Server Error");
        }
    });


    //Endpoint for deleting a user and his profile

    Router.delete('/delete', Isverify, async(req, res) => {
        try {
            //for removing user

            const a = await collection.findOneAndRemove({ _id: req.user.id });

            console.log(a);

            //for deleting user profile

            await ProfileModel.findOneAndRemove({ user: req.user.id });

            res.json({
                msg: "user has deleted"
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json("server error");
        }
    });



    //for updating experinece in profile


    Router.put('/experience', [Isverify, [
        check('title', 'title is required').not().isEmpty(),
        check('company', 'company is required').not().isEmpty(),
        check('from', 'from date is required').not().isEmpty()
    ]], async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array() });
        }


        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;


        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };


        try {

            const profile = await ProfileModel.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).json("server error")
        }

    });

    //deleting profile experience


    Router.delete('/experinece/:exp_id', Isverify, async(req, res) => {
        try {
            const profile = await ProfileModel.findOne({ user: req.user.id });
            const Default = profile.experience.length;

            for (let experience = 0; experience < profile.experience.length; experience++) {
                if (profile.experience[experience]._id == req.params.exp_id) {
                    profile.experience.splice(experience, 1);
                    console.log(profile);
                    break;
                }
            }

            await profile.save();
            //for validating the experience id

            if (profile.experience.length < Default) {
                return res.json(profile);
            }
            res.status(400).json("experience id is not valid");

        } catch (err) {
            console.error(err.message);
            res.status(500).json("server error");
        }

    });

};