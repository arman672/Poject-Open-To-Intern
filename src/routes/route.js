const express = require('express');
const router = express.Router();

const collegeController = require('../controllers/collegeControllers')
const internController = require('../controllers/internControllers')

router.post('/functionup/colleges',collegeController.collegeDetails)

module.exports = router;