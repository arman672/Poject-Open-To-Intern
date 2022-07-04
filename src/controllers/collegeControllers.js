
const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
//const validUrl = require("valid-url")

const createCollege = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin','*')
    try {
        let data = req.body

        if(Object.keys(data).length == 0){
            return res.status(400).send({status : false, message : "Plese enter the mandatory details"})
        }

        const { name, fullName, logoLink } = data //destructuring required fields

        if (!name) {
            return res.status(400).send({ status: false, message: "name is a required field" })
        }

        if (typeof name != "string" || !name.match(/^[a-z]+$/i)) {
            return res.status(400).send({ status: false, message: "name must be in an abbreviated format" })
        }

        if (!fullName) {
            return res.status(400).send({ status: false, message: "FullName is a required field" })
        }
        if(typeof fullName != "string"){
            return res.status(400).send({ status: false, message: "FullName is not valid" })
        }

        //validating full name
        const fullNamePattern = /^[^,]+[A-Za-z, -]+[^,-]+$/
        const regComma = /[,]{1,}/g
        const regCommaConsucative = /[,]{2,}/g
        const regHyphen = /[-]{1,}/g
        const regHyphenConsucative = /[-]{2,}/g
        const regSpaceConsucative = /[ ]{2,}/g
        let valid = true;


        //checking if comma count more then 1
        if((fullName.match(regComma)|| []).length > 1 || (fullName.match(regHyphen)|| []).length > 1 || fullName.trim().length < 5){
            valid = false;
        }  
        //checking if cosucative     
        if(fullName.match(regCommaConsucative) || fullName.match(regHyphenConsucative) || fullName.match(regSpaceConsucative)){
            valid = false;
        }
        //finall check if patern matching and is valid
        if (!fullName.match(fullNamePattern) || valid == false) {
            return res.status(400).send({ status: false, message: "Full name is not valid" })
        }


        if (!logoLink) {
            return res.status(400).send({ status: false, message: "logoLink is a required field" })
        }

        let regUrl = /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|jfif))$/i

        if (typeof logoLink != "string" || !logoLink.match(regUrl)) {
            return res.status(400).send({ status: false, message: "Logo Link url is not valid" })
        }

        if (!await collegeModel.exists({ name: data.name })) {
            let college = await collegeModel.create(data)
            return res.status(201).send({ status: true, message: "Your college has been registered", data: college })
        } else {
            return res.status(400).send({ status: false, message: "the college with this name already exist" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
const collegeDetails = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin','*')
    try {
        let collegeName = req.query.collegeName
        if (!collegeName || collegeName.trim().length == 0) {
            return res.status(400).send({ status: false, message: "College Name is requierd" })
        }
        if (!collegeName.match(/^[a-z]+$/i)) {
            return res.status(400).send({ status: false, message: "College name must be in an abbreviated format" })
        }

        const findCollege = await collegeModel.findOne({ name: collegeName, isDeleted: false }).select({ collegeId: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        if (!findCollege) {
            return res.status(404).send({ status: false, message: "college not found" })
        }

        const internData = await internModel.find({ collegeId: findCollege._id, isDeleted: false }).select({ collegeId: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        if (internData.length == 0) {
            return res.status(404).send({ status: false, message: "No interns found for the given college name" })
        }

        return res.status(200).send({data: { name: findCollege.name, fullName: findCollege.fullName, logoLink: findCollege.logoLink, interns: internData } })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createCollege, collegeDetails }
