const Router = require('express').Router();
const Jwt = require('jsonwebtoken');
const collection = require('./model/User');


require('./controller/users')(Router, collection);
require('./controller/profile')(Router);
require('./controller/posts')(Router);
require('./controller/auth')(Router);







module.exports = Router;