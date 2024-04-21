const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const userController =  require('../controller/userController')

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/update').post(authController.protect,userController.userUpdate)
router.route('/me').get(authController.protect,userController.getMe)
router.route('/verifyemail/:id').get(authController.verifyEmail)



module.exports = router