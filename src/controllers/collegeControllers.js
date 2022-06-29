const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')
const validation = require('../validation/validation')

exports.collegeDetails = async (req, res) => {
    try {
        let collegeName = req.params.name
        if (!collageName || collegeName.trim().length == 0) {
            return res.status(400).send({ status: false, msg: "Collage Name is requierd" })
        }
        const findCollege = collegeModel.findOne({ name: collegeName, isDeleted: false }).select({ isDeleted: 0 })
        if(!findCollege){
            return res.status(404).send({ status: false, msg: "college not found" })
        }
        const internData = internModel.find({ collegeId: findCollege.collegeId, isDeleted: false}).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        if(internData.length == 0){
            return res.status(404).send({ status: false, msg: "no interns found for the given link"})
        }
        return res.status(200).send({ data: { findCollege, interns: internData } })
    } catch (err) {
        return res.status(500).send({status: false, msg: err.message})
    }
}

exports.collegeDetails = async (req, res) => {
    try {
        let collegeName = req.params.name
        if (!collageName || collegeName.trim().length == 0) {
            return res.status(400).send({ status: false, msg: "Collage Name is requierd" })
        }
        const findCollege = collegeModel.findOne({ name: collegeName, isDeleted: false }).select({ isDeleted: 0 })
        if(!findCollege){
            return res.status(404).send({ status: false, msg: "college not found" })
        }
        const internData = internModel.find({ collegeId: findCollege.collegeId, isDeleted: false}).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        if(internData.length == 0){
            return res.status(404).send({ status: false, msg: "no interns found for the given collage name"})
        }
        return res.status(200).send({ data: { findCollege, interns: internData } })
    } catch (err) {
        return res.status(500).send({status: false, msg: err.message})
    }
}