const express = require('express');
const router = express.Router();
const collegeControllers= require ("../controllers/collegeControllers")
const internControllers = require("../controllers/internControllers")



router.post("/functionup/colleges", collegeControllers.createCollege)

router.post("/functionup/interns", internControllers.createIntern)



module.exports = router;