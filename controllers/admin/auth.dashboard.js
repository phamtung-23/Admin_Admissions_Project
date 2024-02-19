import OTP from '../../models/OTP.js'
import User from '../../models/User.js'
import Customer from '../../models/Customer.js'
import Project from '../../models/Project.js'
import Service from '../../models/Service.js'
import { mongooseToObject } from '../../utils/mongooses.js'
import nodemailer from 'nodemailer'

// [GET] /login
export const showLogin = (req, res, next) => {
  res.render('auth/login',{layout: false})
}
// [GET] /authorized
export const errorPermission =  (req, res, next) => {
  res.render('errorPermission',{layout: false})
}
// Dashboard [GET] /
export const showDashboard = async (req, res, next) => {
  try {
    const user  = await User.findOne({_id: req.user.id})
    const userNumber  = await User.find().countDocuments()
    const customerNumber  = await Customer.find().countDocuments()
    const projectNumber = await Project.find().countDocuments()
    const serviceNumber = await Service.find().countDocuments()
    res.render('home', {
      user: mongooseToObject(user),
      userNumber,
      customerNumber,
      projectNumber,
      serviceNumber,
      activeSideBar: 'dashboard'
    })
  } catch (error) {
    next()
  }
    
}
// [GET] /logout
export const logout = (req,res)=>{
  res.clearCookie("access_token")
  res.redirect('/')
}

// [GET] /forgot
export const showForgotPassword = (req,res)=>{
  res.render('auth/forgot', {layout: false})
}
// [POST] /forgot
export const handleForgotPassword = async (req, res, next)=>{
  const {email} = req.body
  const existOTP = await OTP.findOne({email})
  let randomOTP = Math.floor(Math.random() * (999999 - 100000) + 100000);
  
  const user = await User.findOne({ email: email})
  if (!user) {
    return res.status(404).json({ message: 'The email address you provided does not exist, please check again!'});
  }

  // check allow
  if(existOTP && !existOTP.isAllow ){
    // format dd/mm/yy h:m:s Date for existOTP.dateBlock
    const dateBlock = existOTP.dateBlock.getDate() + '/' + (existOTP.dateBlock.getMonth()+1) + '/' + existOTP.dateBlock.getFullYear() + ' ' + existOTP.dateBlock.getHours() + ':' + existOTP.dateBlock.getMinutes() + ':' + existOTP.dateBlock.getSeconds();
    return res.status(400).json({ message: 'You have exceeded the allowed number of incorrect attempts. Please try again later: '+dateBlock});
  }

  let testAccount = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: 'pttung23082001@gmail.com', // generated ethereal user
      pass: 'iddsxkvtynkatpxv', // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: "pttung23082001@gmail.com", // sender address
    to: email, // list of receivers
    subject: "OTP-Restore Password", // Subject line
    // text: "Mã xác minh của bạn là: 123456", // plain text body
    html: `<p>${randomOTP} is your verification code.</p>`, // html body
  },(err) => {
    if(err){
      return res.status(400).json({ message: 'An error occurred during the email sending process!'});
    }else{
      if(existOTP){
        existOTP.code = randomOTP
        existOTP.save();
      }else{
        const newOTP = new OTP({
          email,
          code: randomOTP
        });
        newOTP.save();
      }
      
      return res.status(200).json({ message: 'Code sent successfully!'});
    }
  });
  
}

// [GET] /forgot/otp
export const showInputOtp = (req,res)=>{
  res.render('auth/otp', {layout: false})
}

// [POST] /forgot/otp
export const handleOtp = async (req, res, next)=>{
  const {code, email} = req.body
  const currentOtp = await OTP.findOne({email})
  if (!currentOtp) {
    return res.status(400).json({ message: 'OTP does not exist, please press send code!'});
  }
  if(code != currentOtp.code){
    // get current time and save updatedAt OTP
    const currentTime = new Date();
    
    // clock 24h
    if (currentOtp.isFalse >=3 && currentOtp.isAllow){
      const dateBlock = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
      currentOtp.isAllow = false;
      currentOtp.dateBlock = dateBlock;
      currentOtp.save();
      // set timeout for dateBlock to auto set currentOtp.isAllow = true and currentOtp.dateBlock = null;
      setTimeout(() => {
        currentOtp.isAllow = true;
        currentOtp.dateBlock = null;
        currentOtp.isFalse = 0;
        currentOtp.save();
      }, 24 * 60 * 60 * 1000); 
      return res.status(400).json({ message: 'You have entered incorrectly too many times. Please try again later.'});
    }
    if(!currentOtp.isAllow){
      return res.status(400).json({ message: 'You have entered incorrectly too many times. Please try again later.'});
    }
    currentOtp.updatedAt = new Date();
    currentOtp.isFalse = currentOtp.isFalse + 1;
    currentOtp.save();

    return res.status(400).json({ message: 'Incorrect OTP code, please try again!'});
  }
  return res.status(200).json({ message: 'Verification successful!'});
}


// [GET] /search
export const handleSearch = async (req,res)=>{
  try {
    const { model, q } = req.query
    let result
    let html = ''
    switch(model) {
      case 'users':
        result = await User.find({ $or:[
          {fullname: { $regex: q, $options: 'i' }},
          {username: { $regex: q, $options: 'i' }}
        ]
        })
        // loop result and render to html 
        result.forEach((user) => { 
          html += `
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <img src="../assets/img/PTSC/icon-user.png" class="avatar avatar-sm me-3" alt="user icon" />
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">${user.username}</h6>
                    <p class="text-xs text-secondary mb-0">${user.email}</p>
                  </div>
                </div>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">${user.fullname}</span>
              </td>
              <td>
                ${user.isAdmin ? `<p class="text-xs font-weight-bold mb-0">Admin</p>` : user.isManager ? `<p class="text-xs font-weight-bold mb-0">Manager</p>` : `<p class="text-xs font-weight-bold mb-0">User</p>`}
                <p class="text-xs text-secondary mb-0">Organization</p>
              </td>
              <td class="align-middle text-center text-sm">
              ${user.isActive ? `<span class="badge badge-sm bg-gradient-success">Active</span>` : `<span class="badge badge-sm bg-gradient-secondary">Inactive</span>`}
              </td>
              <td class="align-middle text-center" style="width: 150px !important;">
                <a href="/users/${user._id}/edit" class="text-secondary font-weight-bold text-xs">
                  Edit
                </a>
              </td>
              <td class="align-middle text-center" style="width: 150px !important;">
                <a href="javascript:;" class="text-secondary font-weight-bold text-xs"
                id="deleteUser" data-toggle="tooltip"
                  data-original-title="Edit user" onclick="deleteUser('${user._id}','${user.username}')">
                  delete
                </a>
              </td>
            </tr>`
         })
         
        break;
      case 'fields':
        // code block
        break;
      default:
        // code block
    }
   
    
    return res.status(200).json(html)

  } catch (error) {
      return res.status(400).json({ message: 'An error occurred during the search process!'});
  }
}


