const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')



exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  user.password = undefined
  res.status(200).json({
    status: 'success',
    user
  })
})


exports.userUpdate = catchAsync(async (req, res, next) => {
  const { firstName, lastName, age, gender } = req.body
  const user = await User.findByIdAndUpdate(req.user.id,
    { firstName: firstName, lastName: lastName, age: age, gender: gender }, {
    new: true,
    runValidators: true
  })

  return res.status(200).json({
    status: 'success',
    user
  })
})