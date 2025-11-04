const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'subadmin', 'sales'],
    default: 'sales',
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User
