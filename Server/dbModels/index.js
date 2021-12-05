const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const index = {};
index.mongoose = mongoose;

index.user = require("./user.model");
index.role = require("./role.model");

index.ROLES = ["user", "admin", "moderator"];

module.exports = index;
