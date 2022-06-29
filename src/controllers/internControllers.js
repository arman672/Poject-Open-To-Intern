const internModel = require("../models/internModel.js")
const collegeModel = require("../models/collegeModel.js")
const validator = require ("email-validator")



const createIntern = async (req,res)=>{
    try{
        const data = req.body
        const { name, mobile, email, collegeName} = data // destructuring the required fields from data

        if(!name){
            return res.status(400).send({status : false, msg : "name is required field"})
        }

        let namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,24}$/gi // creating a pattern for valid name with regex
        
        if(!name.match(namePattern)){ //in case the name from the data does not match our pattern
            return res.status(400).send({status : false, msg : "This is not a valid Name"})
        } 

        if(!email){
            return res.status(400).send({status : false, msg : "email is a required field"})
        }

        const validEmail = validator.validate(email) // using email-validator to validate the recieved email
        if(!validEmail){
            return res.status(400).send({status : false, msg : "this email is not valid"})
        } 

        let findEmail = await internModel.findOne({email : email}) // in case our email is valid, then we check if it's already being used by some user

        if(findEmail){
            return res.status(400).send({status : false, msg : "a user with this email already exist"})
        }
        
        if(!mobile){ 
            return res.status(400).send({status : false, msg : "Mobile is a required field and can not be empty"})
        }
        const mobiles = mobile.replace(/\s+/g, '') // removing space from in between in case we recieved (+91 9876543212)

        const mobilePattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/g // declaring valid phone number pattern
       
        if(!mobiles.match(mobilePattern)){ 
            return res.status(400).send({status : false, msg : "This is not a valid Mobile Number"})
        } 

        let findMobile = await internModel.findOne({mobile : mobile}) 
        if(findMobile){
            return res.status(400).send({status : false, msg : "a user with this mobile already exist"})
        }
        
        if(!collegeName){
            return res.status(400).send({status : false, msg : "college name is a required field"})
        } 
            
        const findcollege = await collegeModel.findOne({name : collegeName}) // checking for the college if any with that name exists
        if(!findcollege){
            return res.status(400).send({status : false, msg : "no college with this name exists"})
        }

        if(findcollege.isDeleted === true){ //checking if the found college is deleted or not
            return res.status(400).send({status : false, msg : "This college is no longer with us"})
        } 

        const collegeId = findcollege._id // storing the id of the college we found in collegeId variable

        const internData = {
            name, 
            mobile,
            email,
            collegeId
        } 

        const findIntern = await internModel.findOne(internData) 

        if(findIntern){
            return res.status(400).send({status : false, msg : "student intern already exists"})
        } 
         
        const createIntern = await internModel.create(internData) //creating a new intern in case we don not found any with the given data

        if(createIntern){
            return res.status(201).send({status : true, msg : "you have successfully registered", data : createIntern})
        }// our response upon creating the intern successfully

    }
    catch(err){
        return res.status(500).send({status : false, err : err.message})
    }
}

module.exports = {createIntern}