
const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const validUrl = require("valid-url")

const createCollege = async (req, res) => {
    try {
        let data = req.body

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

        //validating url
        const isValidUrl = function (url) {
            if (validUrl.isUri(url)) return true;
            else return false
        }

        if (!isValidUrl(logoLink)) {
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
