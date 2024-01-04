const {StatusCodes} = require('http-status-codes')

const CustomAPIError = require('../errors/custom-api')

class UnauthenticatedError extends CustomAPIError{
  constructor(message){
    super(message);
    this.StatusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError