const Router = require('express').Router();
const Jwt = require('jsonwebtoken');
const collection = require('./model/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const request = require('request');
const Isverify = require('./middleware/Auth');
const ProfileModel = require('./model/Profile');
const PostModel = require('./model/Post');

const { check, validationResult } = require('express-validator');



require('./controller/users')(Router, collection, bcrypt, gravatar, Jwt);
require('./controller/profile')(Router, collection, ProfileModel, Isverify, request);
require('./controller/posts')(Router, collection, ProfileModel, PostModel, Isverify, check, validationResult);
require('./controller/auth')(Router, Isverify, collection, bcrypt, Jwt);








module.exports = Router;