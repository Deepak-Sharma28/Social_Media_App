const { check, validationResult } = require('express-validator');
module.exports = (Router, collection, bcrypt, gravatar, Jwt) => {


    //post endpoint for ragister a user


    Router.post('/users', [
            check('name', 'Name is required').not().isEmpty(),
            check('email', 'email is required').isEmail(),
            check('password', 'password is required').isLength({ min: 6 })
        ],
        async(req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {

                res.status(400).json({
                    "errors": errors.array()
                });
            }

            const {
                name,
                email,
                password
            } = req.body;
            try {
                // if user already exists

                let user = await collection.findOne({ email });
                if (user) {
                    res.status(400).json({
                        errors: [{ msg: "user already exists" }]
                    });
                }

                //get the gravatar of the user

                const avatar = gravatar.url(email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });

                //making a new collection and assigning to let user

                user = new collection({
                    name,
                    email,
                    password,
                    avatar
                });
                //ecrypt the password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                //saving the collection of the data
                user.save();

                //making a json web token

                console.log(user);
                console.log(user.id);

                let payload = {
                    user: {
                        id: user.id
                    }
                };

                Jwt.sign(payload, process.env.mySecret, (err, token) => {
                    if (err) throw err;

                    res.json({ token });
                });


            } catch (err) {

                console.error(err.message);

                res.status(500).send('server error');
            }
        });

};