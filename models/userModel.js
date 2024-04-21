const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    require: [true, 'Please Provide Your Email Address'],
    validate: [validator.isEmail, 'Please Provide a valid Email Address']
  },
  firstName: {
    type: String,
    require: [true, 'Please Provide your first Name']
  },
  lastName: {
    type: String,
    require: [true, 'Please Provide Your Last Name']
  },
  gender: {
    type: String,
    require: [true, "Please Provide Gender"]
  },
  age: {
    type: Number,
    require: [true, "Please Provide Your Age"]
  },
  password: {
    type: String,
    require: [true, 'Please Provide your password'],
    minLength: 8,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationCode: String

})




userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})


userSchema.methods.correctPassword = async function (plainPassword, hashPassword) {
  // console.log('comparepass',plainPassword,hashPassword)
  return await bcrypt.compare(plainPassword, hashPassword)
}


// userSchema.methods.emailVerificationGen = async function () {
//   const code = await crypto.randomBytes(40).toString("hex");
//   this.emailVerificationCode = await crypto
//     .createHash("sha256")
//     .update(code)
//     .digest("hex");
//   this.emailVerificationCodeExpire = Date.now() + 1000 * 60 * 10;

//   return code;
// };

userSchema.methods.emailVerificationCodeGen = async function(){
  const code = await crypto.randomBytes(40).toString('hex')
  // console.log(code);
  this.emailVerificationCode = await crypto.createHash('sha256').update(code).digest('hex')
  return code
}

const User = mongoose.model('User', userSchema)
module.exports = User