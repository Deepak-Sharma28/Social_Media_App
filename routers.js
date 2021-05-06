const Router = require('express').Router();
const Jwt = require('jsonwebtoken');


require('./controller/users')(Router);
require('./controller/profile')(Router);
require('./controller/posts')(Router);
require('./controller/auth')(Router);







module.exports = Router;