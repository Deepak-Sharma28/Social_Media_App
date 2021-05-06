const { check, validationResult } = require('express-validator/check');
module.exports = (Router, collection) => {
    //post endpoint for ragister a user

    Router.post('/users', [
            check('name', 'Name is required').not().isEmpty(),
            check('email', 'email is required').isEmail(),
            check('password', 'password is required').isLength({ min: 6 })
        ],
        async(req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.log(errors);
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
                //if user already exists

                let user = await collection.findOne({ email });
                if (user) {
                    res.status(400).json({
                        errors: [{ msg: "user already exists" }]
                    });
                }

            } catch (err) {
                console.error(err.message);
                res.status(500).send('server error');
            }
        });

};