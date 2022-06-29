const college = require('../models/collegeModel.js')
const intern = require('../models/internModel.js')
const mongoose = require('mongoose')

// ----------------------- Validation College Model --------------------------
let collegeValidation = async function(req,res,next){
    let data = req.body
    if(!data){return res.status(400).send({status : false, msg : " Please enter details in the request Body"})}

    let name= data.name
    if(!name){return res.status(400).send({status : false, msg : "name field is require"})}

    function nameValidate(name){
        var re=/\d/;
        if(re.test(name)==true){
            return res.status(400).send({status : false, msg : "fullName contains number Please change it"})
        }
    }
    
    let checkName = await college.findOne({name : name})
        if(checkName){return res.status(400).send({status : false, msg : "name is already exist in the database"})}

       let fullName = data.fullName
       if(!fullName){return res.status(400).send({status : false, msg : "fullName field is requried"})}
       
       function nameValidate(fullName){
        var re=/\d/;
        if(re.test(fullName)==true){
            return res.status(400).send({status : false, msg : "fullName contains number Please change it"})
        }
    }
       let logoLink = data.logoLink
       if(!logoLink){return res.status(400).send({status : false, msg : "logoLink field is required"})}

    }
     // ----------------------- Validation Intern Model --------------------------
    let internValidation = async function(req,res,next){
        let data = req.body
        if(!data){return res.status(400).send({status : false, msg: "Please enter details in the Request Body"})}

        let name = data.name
        if(!name){return res.status(400).send({status : false, msg : "name field is required"})}

        let email = data.email
        if(!email){return res.status(400).send({status : false, msg : "email field is required"})}}

        function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        if(re.test(email)==false){
            return res.status(400).send({status : false, msg : "you enter a invalid Email-Id"})
        }
    }
    let checkEmail = await intern.findOne({email:email})
    if(checkEmail){return res.status(400).sende({status : false, msg : "Email-Id is already exists"})}


     let mobile = data.mobile
     if(!mobile){return res.status(400).send({status : false, msg : "mobile field is required"})}

     if(mobile.length!=10){return res.status(400).send({status : false, msg : "mobile number length is not accurate"})}


     function validateMobile(mobile) {
        var re = /^\d{10}$/;
        if(re.test(mobile)==false){
            return res.status(400).send({status : false, msg : "you enter a invalid Mobile number"})
        }

        let checkMobile = await intern.findOne({mobile:mobile})
        if(checkMobile){return res.status(400).send({status : false, msg : "This Mobile Number is already exists"})}

        let collegeId = req.body.collegeId
        if(!collegeId){return res.status(400).send({status : false, msg : "collegeId field is required"})}

        if(!mongoose.isValidObjectId(collegeId)){return res.status(400).send({status : false, msg : "collegeId you enter is invalid"})}

        let check = await college.findById(collegeId)
        if(!check){return res.status(400).send({status : false, msg : " collegeId does not exists in the database"})}

    
    }
    module.exports.collegeValidation=collegeValidation
    module.exports.internValidation=internValidation

    // let getDetails = async function(req,res){
    //     let collegeName=req.query.collegeName
    //     if(!collegeName){return res.status(400).send({status : false, msg : "collgeName is required"})}

    //     let findName = await college.findOne({name : collegeName})
    //     let id= findName._id
    //     let findIntern = await intern.find({_id : id}).select({name:1,email:1,mobile:1})
        
    //     if(!findIntern.length>0){return res.status(400).send({status : false, msg : "No data found"})   }

    //     let newData = {
    //         name : collgeName,
    //         fullName : findName.fullName,
    //         logoLink : findName.logoLink,
    //         interns : findIntern
    //     }

    //     return res.status(200).send({status : true, data ; newData})


    // }
