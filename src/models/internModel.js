const mongoose = require ("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
//ref & populate
const internSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    mobile : {
       type : String,
       required : true,
       unique : true,
       trim : true
    },
    collegeId : {
        type : objectId,
        ref : 'College',
        required : true,
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
}, {timestamps : true})

module.exports =  mongoose.model("intern", internSchema)