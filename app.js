require('dotenv').config()

require('express-async-errors')

const helmet = require('helmet')

const cors = require('cors')

const xss = require('xss-clean')

const rateLimiter = require('express-rate-limit')

    /*
    helmet-Helmet helps secure Express apps by setting HTTP response headers.

    cors-CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
    cross-origin-resource-sharing can be done

    xss-clean-
    express-rate-limit-zuplo
    */

const express = require('express');

const app = express();

const ConnectDB = require('./db/connect')

const authenticationUser = require('./middlewares/authentication')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

const notFound = require('./middlewares/not-found')
const errorHandler = require('./middlewares/error-handler')

//middleware to set setting to a value

app.set('trust proxy',1);

app.use(rateLimiter())

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 100,  //15 minutes
    max: 100 // limit each IP to requests per windowMs
  })
)

app.use(express.json())
app.use(helmet());
app.use(cors());
app.use(xss);


app.get('/hello', (req, res) => {
  res.send('jobs api')
})

app.use('/api/v1/auth', authRouter)


//middleware is used for all the job features/fields

app.use('/api/v1/jobs', authenticationUser, jobsRouter)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000

const start = async (req, res) => {
  try {
    await ConnectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log('App is listening')
    })
  }
  catch (error) {
    console.log(error)
  }

}
start()