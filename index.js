import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors'

import {connect} from './connectDb.js'
import cookieParser from 'cookie-parser'

import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import universityRoute from './routes/university.js'
import bannerRoute from './routes/banner.js'
import messagesRoute from './routes/messages.js'
import messagesPdfRoute from './routes/messagesPdf.js'
import flowiseApi from './routes/flowise.js'

import beUsersRoute from './routes/admin/users.js'
import siteRoute from './routes/admin/site.js'
import beSetting from './routes/admin/setting.js'
import beUniversity from './routes/admin/university.js'
import beChat from './routes/admin/chat.js'
import beBanner from './routes/admin/banner.js'
import beFile from './routes/admin/file.js'

import handlebars from 'express-handlebars'

const app = express()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config()

app.use(cors());
app.use(cookieParser())
app.use(express.urlencoded({
  extended: true,
  limit: '100mb',
  parameterLimit: 50000,
}))
app.use(express.json({limit: '100mb'}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.static(path.join(__dirname, 'outputPDF')))
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
app.use('/chat',beChat)
app.use('/banner',beBanner)
app.use('/file',beFile)

app.use('/setting',beSetting)

// router for api
app.use('/api/auth',authRoute)
app.use('/api/users',usersRoute)
app.use('/api/university',universityRoute)
app.use('/api/banner',bannerRoute)
app.use('/api/messages',messagesRoute)
app.use('/api/messagesPdf',messagesPdfRoute)

// api Flowise
app.use("/api/flowise", flowiseApi)





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