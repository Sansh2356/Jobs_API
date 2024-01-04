const Job = require('../model/jobs')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotfoundError } = require('../errors')


const getAllJobs = async (req, res) => {
  const jobs = await job.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ jobs })
}
const getJob = async (req, res) => {

  //getting the user id and job id for getting a particular job coressponding to 
  //a particular user.
  
  const { user: { userId }, params: { id: jobId } } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  })
  if (!job) {
    throw new NotfoundError(`No job found with the id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}
const createJob = async (req, res) => {

  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  req.status(StatusCodes.CREATED).send(job)
}
const updateJob = async (req, res) => {
  const { user: { userId }, params: { id: jobId }, body: { company, position } } = req;
  if (company === '' || position === '') {
    throw new BadRequestError('Company or position fields cannot be empty')
  }
  const job = await Job.findByIdAndUpdate({
    _id: jobId, createdBy: userId
  }, req.body, { new: true, runValidators: true })

  if (!job) {
    throw new NotfoundError(`No job found with the id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {

  const { user: { userId }, params: { id: jobId }, body: { company, position } } = req;

  const job = await Job.findByIdAndDelete({
    _id: jobId, createdBy: userId
  })

  if (!job) {
    throw new NotfoundError(`No job found with the id ${jobId}`)
  }

  res.status(StatusCodes.OK).send({ job })
}


module.exports = {
  getAllJobs, getJob, updateJob, createJob, deleteJob
}