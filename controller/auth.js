const { check, validationResult } = require('express-validator');

module.exports = (Router, Isverify, collection, bcrypt, Jwt) => {

    //get req for auth the user

    Router.get('/api/auth', Isverify, async(req, res) => {
        try {
            const user = await collection.findById(req.user.id).select('-password');
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });


    //post request for auth user

    Router.post('/login', [
        check('email', 'email is required').isEmail(),

        check('password', 'password is required').exists()

    ], async(req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const { password, email } = req.body;

        try {
            let user = await collection.findOne({ email });

            if (!user) {
                res.status(400).json({ error: { msg: "invalid Crediantials" } });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                res.status(400).json({ error: { msg: "invalid Crediantials" } });
            }

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