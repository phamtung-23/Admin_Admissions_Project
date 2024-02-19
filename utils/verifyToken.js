import jwt from 'jsonwebtoken'
import { createError } from './error.js'

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token
  if(!token) {return next(createError(401, 'you are not Authentication!'))}
  
  jwt.verify(token, process.env.JWT, (err,  user) => {
    if(err) {return next(createError(403, "Token is not valid!"))}
    req.user = user
    next()
  })
}
export const verifyTokenMobile = (req, res, next) => {
  let token = req.cookies.access_token
  if (req.headers['authorization']){
     token = req.header('Authorization').replace('Bearer ', '')
  }
  
  if(!token) {return next(createError(401, 'you are not Authentication!'))}
  
  jwt.verify(token, process.env.JWT, (err,  user) => {
    if(err) {return next(createError(403, "Token is not valid!"))}
    req.user = user
    next()
  })
}


export const verifyManager = (req, res, next) => {
  verifyToken(req, res ,() => {
    if(req.user.id === req.params.id && req.user.isManager || req.user.isAdmin){
      next()
    }else{
      return next(createError(403, 'you are not Authorized!'))
    }
  })
}


export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.isAdmin){
      next()
    }else{
      return next(createError(403, 'you are not Authorized!'))
    }

  })
}


export const verifyDashboard = (req, res, next) => {
  const token = req.cookies.access_token
  if(!token) {
    res.redirect('/login')
  }
  
  jwt.verify(token, process.env.JWT, (err,  user) => {
    if(err) {
      res.redirect('/login')
    }
    req.user = user
    // console.log(req.user.id, req.params.id)
    if(req.user.id === req.params.id && req.user.isManager || req.user.isAdmin){
      next()
    }else{
      res.redirect('/authorized')
    }
  })
}



export const verifyTokenDashboard = (req, res, next) => {
  const token = req.cookies.access_token
  if(!token) {res.redirect('/login')}
  
  jwt.verify(token, process.env.JWT, (err,  user) => {
    if(err) {res.redirect('/login')}
    req.user = user
    next()
  })
}
export const verifyDashboardManager = (req, res, next) => {
  verifyTokenDashboard(req, res ,() => {
    if(req.user.isManager || req.user.isAdmin){
      next()
    }else{
      res.redirect('/authorized')
    }
  })
}
export const verifyDashboardAdmin = (req, res, next) => {
  verifyTokenDashboard(req, res, () => {
    if(req.user.isAdmin){
      next()
    }else{
      res.redirect('/authorized')
    }

  })
}
