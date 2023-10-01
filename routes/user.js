// const express=require('express');
// const path = require('path');

// const userController=require('../controller/user');

// const router=express.Router();

// router.post('/signup', userController.signup);
// router.post('/login', userController.login);

// module.exports = router;

const express = require('express');
const userController = require('../controller/user');

const router = express.Router();


router.post('/signup', userController.signup);

router.post('/login', userController.login)

module.exports = router;