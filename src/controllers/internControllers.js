const internModel = require("../models/internModel.js")
const collegeModel = require("../models/collegeModel.js")
const validator = require ("email-validator")



const createIntern = async (req,res)=>{
    try{
        const data = req.body
        
        if(Object.keys(data).length == 0){
            return res.status(400).send({status : false, message : "Plese enter the mandatory details"})
        } 

        const { name, mobile, email, collegeName} = data // destructuring the required fields from data

        if(!name){
            return res.status(400).send({status : false, message : "name is a required field"})
        }
        let namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,24}$/gi // creating a pattern for valid name with regex        
        if(!name.match(namePattern)){ //in case the name from the data does not match our pattern
            return res.status(400).send({status : false, message : "This is not a valid Name"})
        } 

        if(!email){
            return res.status(400).send({status : false, message : "email is a required field"})
        }
        const validEmail = validator.validate(email) // using email-validator to validate the recieved email
        if(!validEmail){
            return res.status(400).send({status : false, message : "email is not valid"})
        } 

        if(!mobile){ 
            return res.status(400).send({status : false, message : "Mobile is a required field and can not be empty"})
        }
        const mobiles = mobile.replace(/\s+/g, '') // removing space from in between in case we recieved (+91 9876543212)
        const mobilePattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/g // declaring valid phone number pattern   
        if(!mobiles.match(mobilePattern)){ 
            return res.status(400).send({status : false, message : "This is not a valid Mobile Number, only indian numbers are accepted."})
        } 

        if(!collegeName){
            return res.status(400).send({status : false, message : "college name is a required field"})
        }  
        if (!collegeName.match(/^[a-z]+$/i)) {
            return res.status(400).send({ status: false, message: "name must be in an abbreviated format" })
        }   
        const findcollege = await collegeModel.findOne({name : collegeName}) // checking for the college if any with that name exists
        if(!findcollege){
            return res.status(404).send({status : false, message : "College not found"})
        }

        if(findcollege.isDeleted === true){ //checking if the found college is deleted or not
            return res.status(404).send({status : false, message : "college is deleted"})
        } 

        //checking if intern already exist
        const collegeId = findcollege._id // storing the id of the college we found in findcollege variable
        const internData = {
            name, 
            mobile,
            email,
            collegeId
        } 
        const findIntern = await internModel.findOne(internData) 
        if(findIntern){
            return res.status(400).send({status : false, message : "student intern already exists"})
        } 

        //checking if email or mobile alredy exist in db
        let findEmail = await internModel.findOne({email : email}) // in case our email is valid, then we check if it's already being used by some user
        if(findEmail){
            return res.status(400).send({status : false, message : "a user with this email already exist"})
        }
        let findMobile = await internModel.findOne({mobile : mobile}) 
        if(findMobile){
            return res.status(400).send({status : false, message : "a user with this mobile already exist"})
        }
          
        const createIntern = await internModel.create(internData) //creating a new intern in case we don not found any with the given data

        if(createIntern){
            return res.status(201).send({status : true, message : "you have successfully registered", data : createIntern})
        }// our response upon creating the intern successfully

    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}

module.exports = {createIntern}
