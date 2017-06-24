'use strict';

const mongoose  = require('mongoose');

let Schema  = mongoose.Schema;

let UserSchema = new Schema({
  gender: String,
  name: Object,
  location: Object,
  email: String,
  login: Object,
  dob: Date,
	registered: Date,
	phone: String,
	cell: String,
	id: Object,
	picture: Object,
	nat: String

},{collection: 'users'});

module.exports = mongoose.model('Users', UserSchema);
