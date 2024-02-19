import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';

import {connect} from './connectDb.js'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import oilfieldRoute from './routes/oilField.js'
import projectRoute from './routes/project.js'

import beUsersRoute from './routes/admin/users.js'
import siteRoute from './routes/admin/site.js'
import beOilfieldRoute from './routes/admin/oilField.js'
import beCustomer from './routes/admin/customer.js'
import beService from './routes/admin/service.js'
import beIcon from './routes/admin/icon.js'
import beProject from './routes/admin/project.js'
import beSetting from './routes/admin/setting.js'
import beUniversity from './routes/admin/university.js'

import handlebars from 'express-handlebars'

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config()

app.use(cookieParser())
app.use(express.urlencoded({
  extended: true,
  limit: '100mb',
  parameterLimit: 50000,
}))
app.use(express.json({limit: '100mb'}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))
// template engine
app.engine('hbs', handlebars.engine({
  extname:'.hbs',
  helpers:{
    compare: (a,b) => {
      if (a == b) return true
      else return false
    },
    checkContainArray: (idToCheck,array) => {
      return array.includes(idToCheck.toString())
    },
    checkContainObject: (idToCheck,objects) => {
      return objects.includes(idToCheck.toString())
    },
    compareID: (a,b) => {
      if (a.toString() === b.toString()) return true
      else return false
    }
  }},
));
app.set('view engine','hbs')
app.set('views', path.join(__dirname, 'resources/views'))

// Router
app.use('/',siteRoute)
app.use('/users',beUsersRoute)
app.use('/university',beUniversity)
app.use('/fields',beOilfieldRoute)
app.use('/customer',beCustomer)
app.use('/service',beService)
app.use('/icon',beIcon)
app.use('/project',beProject)
app.use('/setting',beSetting)

// router for api
app.use('/api/auth',authRoute)
app.use('/api/users',usersRoute)
app.use('/api/fields',oilfieldRoute)
app.use('/api/project',projectRoute)


// handle error
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || 'SomeThing went wrong!'
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  })
})

app.listen(3300, () => {
  connect()
})