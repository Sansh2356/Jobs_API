const CustomAPIError = require('./custom-api')
const UnauthenticatedError = require('./unauthenticated')
const NotfoundError= require('./not-found')
const BadRequestError = require('./bad-request')

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  BadRequestError,
  NotfoundError
}