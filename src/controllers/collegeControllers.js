
const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
//const validUrl = require("valid-url")

const createCollege = async (req, res) => {
    try {
        let data = req.body

        if(Object.keys(data).length == 0){
            return res.status(400).send({status : false, message : "Plese enter the mandatory details"})
        }

        const { name, fullName, logoLink } = data //destructuring required fields

        if (!name) {
            return res.status(400).send({ status: false, message: "name is a required field" })
        }

        if (!name.match(/^[a-z]+$/i)) {
            return res.status(400).send({ status: false, message: "name must be in anabbreviated format" })
        }

        if (!fullName) {
            return res.status(400).send({ status: false, message: "FullName is a required field" })
        }

        const fullNamePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,150}$/gi

        if (!fullName.match(fullNamePattern)) {
            return res.status(400).send({ status: false, message: "Full name is not valid" })
        }

        if (!logoLink) {
            return res.status(400).send({ status: false, message: "logoLink is a required field" })
        }

        let regUrl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i

        if (!logoLink.match(regUrl)) {
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
    try {
        let collegeName = req.query.name
        if (!collegeName || collegeName.trim().length == 0) {
            return res.status(400).send({ status: false, message: "College Name is requierd" })
        }
        if (!collegeName.match(/^[a-z]+$/i)) {
            return res.status(400).send({ status: false, message: "College name must be in anabbreviated format" })
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
