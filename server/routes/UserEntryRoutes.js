const express = require("express");
const passport = require("passport");
const router = express.Router();
const Student = require("../models/Student");
const Staff = require("../models/Staff");

//still required to check session is still verified etc
router.post("/student",(req,res,next) =>{
    passport.authenticate("student", (err,student,info)  => { //custom call back if you have info in done(err,user,info) acces info
        if (err) return next(err); //actual error 500 teritory
        if(!student) return res.status(400).json({message : info.message});

        //.logIN calls serialize function 
        req.logIn(student, err =>{ //calls serialize user
            if(err) return next(err);
            return res.status(200).json({ message: "success", role: student.role });
        })
    })(req,res,next);
});

router.post("/staff", (req,res,next)=>{
    passport.authenticate("staff", (err,staff,info) =>{
        if(err) return next(err);
        if(!staff) return res.status(400).json({message : info.message});
        if (staff.role !== "staff") return res.status(400).json({message: "Restricted access you are not a staff."})

        req.logIn(staff, err =>{
            if(err) return next(err);
            return res.status(200).json({ message: "success", role: staff.role });
        })
    })(req,res,next);
})

router.get("/status", (req, res) => {
    console.log("Session in /auth/status:", req.session);
    console.log("User:", req.user);
    if (req.isAuthenticated() && req.session.isVerified) {
        console.log(req.user.role);
        return res.json({
            LoggedIn: true,
            user: req.user,
            role: req.user.role
        });
    } else {
        return res.status(401).json({ LoggedIn: false });
    }
});

//this is if req.session.isverifeid is not intialized
router.get("/verify-email", async (req,res) => {

    const { token } = req.query

    if (!token) return res.status(400).json({ message: "Missing token" });  

    try{
        let user = await Student.findOne({
            verificationToken: token,
            tokenExpires: {$gt: new Date()}
        })

        let model = "Student";
        if(!user){
            user = await Staff.findOne({
                verificationToken: token,
                tokenExpires: {$gt : new Date()}
            })
            model = "Staff";
        }
        if(!user) return res.status(400).json({message: "Invalid or expired token"})

        // if it reaches here that means it found the token
        if (model === "Student") {
        await Student.updateOne(
            { _id: user._id },
            { $set: { verificationToken: null, tokenExpires: null } }
        );
        } else {
        await Staff.updateOne(
            { _id: user._id },
            { $set: { verificationToken: null, tokenExpires: null } }
        );
        }        
        
        req.logIn(user, err=>{
            if (err) return res.status(500).json({ message: "Login failed after verification" });
            let URL = "";
            if(process.env.NODE_ENV === "production"){
                URL = process.BASE_URL;
            }
            else{
                URL = "http://localhost:5174"
            }
            req.session.isVerified = true;
            req.session.verifiedEmail = user.email;
            return res.redirect(`${URL}/home`);;
        })


    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error during verification" });
    }
})

router.post("/logout", async(req,res,next) => {
    req.logout(err => {
    if (err) {return next(err)}
        req.session.destroy(() => {
        // clear the session cookie; name must match your express-session cookie
        // default is "connect.sid"
        res.clearCookie("connect.sid", {
            path: "/",            // must match cookie settings in express-session
            httpOnly: true,
            sameSite: "lax",
            secure: false,        // set true if you're on HTTPS
        });
        return res.status(200).json({ success: true });

        })

    })

})

module.exports = router;