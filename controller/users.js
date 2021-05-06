const { check, validationResult } = require('express-validator/check');
module.exports = (Router) => {
    //post endpoint for ragister a user

    Router.post('/users', [
            check('name', 'Name is required').not().isEmpty(),
            check('email', 'email is required').isEmail(),
            check('password', 'password is required').isLength({ min: 6 })
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.log(errors);
                res.status(400).json({
                    "errors": errors.array()
                });
            } else {
                res.send("details are valid");
            }
        });

};