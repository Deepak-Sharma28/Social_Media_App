const Router = require('express').Router();
const Jwt = require('jsonwebtoken');
const collection = require('./model/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const Isverify = require('./middleware/Auth');
const ProfileModel = require('./model/Profile');


require('./controller/users')(Router, collection, bcrypt, gravatar, Jwt);
require('./controller/profile')(Router, collection, ProfileModel, Isverify);
require('./controller/posts')(Router);
require('./controller/auth')(Router, Isverify, collection, bcrypt, Jwt);








module.exports = Router;