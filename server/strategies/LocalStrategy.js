const passport = require("passport");
const Student = require("../models/Student")
const { Strategy } = require("passport-local");
const Staff = require("../models/Staff");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

require("dotenv").config();

passport.use(
    "student",
    new Strategy(
      {
      usernameField: "email",   
      passwordField: "RIN",
      passReqToCallback: true 
      },
    async (req,email, RIN, done) => {
        try{
           const student = await Student.findOne({ RIN });
          if (student == null){
            return done(null, false, { message: "RIN was not found, Please retype your RIN" });
          }
          if (student.email !== email){
            return done(null, false, { message: "RIN does not match with email" });
          }

          //email verification
          if (req.session.isVerified && req.session.verifiedEmail === student.email){
            return done(null,student) //login success
          }

          const token = crypto.randomBytes(64).toString("hex");
          const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

          await student.updateOne({
            $set:{
                verificationToken: token,
                tokenExpires: expires
            }
          })

          console.log("Sending email verification");
          sendVerificationEmail(student,token);
          return done(null, false, {
          message: "Verification email sent. Please check your inbox."
          });
        


        }
      
        catch(err){
            return done(err);
        }   
    })
)

passport.use(
  "staff",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "email",
      passReqToCallback: true
    },
    async(req,email,_unused,done)=>{
      try{
        const staff = await Staff.findOne({email: email});

        if(!staff){
          return done(null, false, {message: "Email of staff was not found, Please retype Email"})
        }
        
        if(req.session.isVerified && req.session.verifiedEmail === staff.email){
          return done(null, staff);
        }

        const token = crypto.randomBytes(64).toString("hex");
        const expires = new Date(Date.now() + 15 *60 *1000);

        await staff.updateOne({
          $set:{
            verificationToken: token,
            tokenExpires: expires
          }
        })

        console.log("Sending email verification")
        sendVerificationEmail(staff, token);
        return done(null, false, {
          message: "Verification email sent. Please check your inbox."
        });
      }
      catch(error){
        return done(err);
      }
    }
  )
)


passport.serializeUser((user,done) => {
    console.log("Serialize user");
    console.log(user);
    done(null, {id: user._id, role: user.role})
})

passport.deserializeUser(async (sessionUser, done) => {
  console.log("deserializeUser was called:", sessionUser);
    try{
        let user = await Student.findById(sessionUser.id)
        if (!user){
          user = await Staff.findById(sessionUser.id)
        }
        if (user === null) return done(new Error("User Not Found in Staff or Student"));
        done(null,user);
    }
    catch(err){
        done(err);
    }
})

async function sendVerificationEmail(user, token) {
  const verifyUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,     
      pass: process.env.GMAIL_PASS      
    }
  });

  await transporter.sendMail({
    from: `"ArchyMart" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: "Verify your RPI Email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your session:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `
  });
}

module.exports = passport;