const CustomAPIError = require('../errors/custom-api')
const {StatusCodes} = require('http-status-codes')

const CustomErrorhandler = (err,req,res,next)=>{
  if(err instanceof CustomAPIError){
    return res.status(err.StatusCode).json({msg:err.message})
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
}
module.exports = CustomErrorhandler