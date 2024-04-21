const AppError = require('../utils/appError')




const handleDuplicateField = (err,res)=>{
        let error  = {...err}
        const message = `Your are already registerd with this ${error.keyValue.email}`
        error = new AppError(message,409)
        res.status(error.statusCode).json({
            status:'duplicate',
            message:error.message
        })
}  

const handleJWTError = (err, res) => {
    let error = {...err} 
    error = new AppError('Invalid token . Please login again',401)
    res.status(error.statusCode).json({
        status:error.status,
        message:error.message
    })
}


module.exports = (err,req,res,next)=>{
    // console.log(err);
    err.statusCode=err.statusCode || 500;
    err.status = err.status || 'error';
    // console.log(err.code);
    if (err.code === 11000) {
        // console.log('duplicate error',err.keyValue.email);
        handleDuplicateField(err,res)
    } else if (err.name === 'JsonWebTokenError') {
        handleJWTError(err,res)
    }else{
        res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        // stack:err.stack,
        })
    } 
}