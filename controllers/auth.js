const User = require('../model/user')
const BadRequestError = require('../errors/index')
const {StatusCodes} = require('http-status-codes')
const UnauthenticatedError = require('../errors/index')

const register = async (req,res)=>{
  console.log('hello register')
  /*
      validate email,name,password
      hash password using bcryptjs
      create token
      send response along with token so that it can
      be accessed in query header

  */
  //saving the user in the user schema and then generating a jwt for the user 

  const user = User.create({...req.body})
  const token = user.createJWT()

  //token requiring header,payload and secret string to generate a specific token
  //instance methods can also be created using mongoose to help us performing the additional functionality
  //upon collection in mongodb to refactor our code.

  res.status(StatusCodes.CREATED).json({user:{name:user.getName()},token})
}
const login = async (req,res)=>{
  const {email,password} = req.body

  if(!email || !password){
    throw new BadRequestError('Please enter password or email')
  }

  const user = await User.findOne({email})
  if(!user){
    throw new UnauthenticatedError('Invalid user please register')
  }

  const token = user.createJWT();

  if(!user.isMatch(token)){
    throw new UnauthenticatedError('Invalid Password')
  } 
  
  res.status(StatusCodes.OK).json({user:{name:user.name},token})

}

module.exports = {
  register,
  login
}