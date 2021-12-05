const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {type: String, required: true},
    },{timestamps:true})

const RoleModel = mongoose.model('Role',roleSchema);
module.exports = RoleModel

