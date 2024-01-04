const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please enter name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    require: [true, 'Please enter name'],
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter valid email'
    ],
    //creating unique emails different form 
    //validators
    unique: true,
  },
  password: {
    type: String,
    require: [true, 'Please enter password'],
  },
})
//using middlewares to refactor the code into shorter paths
//whenever the request string is of create document type
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);

  //each this will point to the a particular document in this collection

  this.password = await bcrypt.hash(this.password, salt);

})
//creation of an instance method //
UserSchema.methods.getName = function () {
  return this.name
}
//Creation of another instance method to generate JWT for new user//

UserSchema.methods.createJWT = function (){
  return jwt.sign(
    {userId:this._id,name:this.name},
    
    process.env.JWT_SECRET,
    {
    
    expiresIn: process.env.JWT_LIFETIME
    
    }
  )
}

UserSchema.methods.checkPassword = async function (Candidatepassword){

  const isMatch = await bcrypt.compare(Candidatepassword,this.password)

  return isMatch
}

module.exports = mongoose.model('User', UserSchema)
