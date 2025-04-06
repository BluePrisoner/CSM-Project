const jwt = require('jsonwebtoken');
require("dotenv").config();

const authenticateUser = async (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        console.log("No token Found");
        return res.redirect("/user/login");
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        console.log("Token Verified")
        next();

    } catch (error) {
        console.log("Authentication Failed");
        res.clearCookie("token");
        return res.render('401Page');
    }
}
const authenticateAdmin = async (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        console.log("No token Found");
        return res.redirect("/admin/login");
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        console.log("Token Verified")
        next();

    } catch (error) {
        console.log("Authentication Failed");
        res.clearCookie("token");
        return res.redirect("/admin/login");
    }
}

module.exports = {authenticateUser,authenticateAdmin};