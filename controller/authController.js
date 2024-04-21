const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/email')
const crypto = require('crypto')




const signToken = async (id) => {
    // console.log(id);
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP * 24 * 60 * 60 * 1000 })

}

const createSendToken = async (user, statusCode, res) => {
    const token = await signToken(user._id)
    // console.log(token);
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP_IN * 24 * 60 * 60 * 1000)
    })
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        user
    })
}


const emailVerificatoion = async (user, req, res,domainName) => {
    // console.log(`url ${req.protocol}://${req.get('host')}`);

    // console.log(await user.emailVerificationCodeGen());

    const otp = await user.emailVerificationCodeGen();
    await user.save({ validateBeforeSave: false })

    try {
        await sendMail({
            email: user.email,
            subject: 'Email Verification process',
            message: `<a href=${domainName}/api/users/verifyemail/${otp} </a>`
        })

        user.password = undefined
        user.emailVerificationCode = undefined
        const token = await signToken(user._id)
        return res.status(200).json({
            token,
            user,
            message: `Please verfiy Your email`
        })

    } catch (error) {
        console.log(error);
    }
}


exports.verifyEmail = catchAsync(async (req, res, next) => {
    // console.log('good', req.params.id);
    const id = await crypto.createHash('sha256').update(req.params.id).digest('hex')
    const verifyOtp = await User.findOne({
        emailVerificationCode:id
    })
    if (!verifyOtp) {
       return next(new AppError('Something went wrong',500))
    }
    verifyOtp.isVerified = true
    verifyOtp.emailVerificationCode=undefined
    verifyOtp.save({validateBeforeSave:false})
    res.status(200).json({
        status: 'sucess',
        message: 'Email Verified Successfully (Please Login)'
    })
})


exports.signup = catchAsync(async (req, res, next) => {
    const { firstName, lastName, gender, age, email, password ,domainName} = req.body
    // console.log('love',{ firstName, lastName, gender, age, email, password });
    // console.log(domainName);
    const user = await User.create({
        firstName,
        lastName,
        age,
        email,
        password,
        gender
    })
    
    emailVerificatoion(user, req, res,domainName)

})

exports.login = catchAsync(async (req, res, next) => {
    // console.log('cookie',req.cookies);
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Please Provide Your credential', 400))
    }
    const userFind = await User.findOne({ email })

    if (!userFind || !(await userFind.correctPassword(password, userFind.password))) {
        return next(new AppError('Email and Password wrong', 404))
    }
    createSendToken(userFind, 201, res)
})




exports.protect = catchAsync(async (req, res, next) => {
    // console.log(req.headers.authorization)
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new AppError('You are lot logged ! please log in to access', 401))
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET)
    const currentUser = await User.findById(decode.id)
    if (!currentUser) {
        return next(new AppError('the user not in database currently '))
    }

    //     /////check if user changed password after the token was issued
    //     // console.log(await currentUser.changePasswordAfter(decode.iat))
    //     if(await currentUser.changePasswordAfter(decode.iat)){
    //         return next(new AppError('User recently changed password, please login again'))
    //     }

    ///Grant Access to protected route///
    req.user = currentUser;
    next()
})


