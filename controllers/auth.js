
const {formValidationErrors} = require('../middleware/formValidationErrors.js');
const pool = require('../db/dbConnect.js')
const {bcrypt} = require('../middleware/bcryptHash.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req,res) => {

    const message =  req.query.message;
    if(!message){
        return res.render('login');
    }
    res.render('login', {errors : [{message : message}]});
}

const dashboard = async (req,res) => {

    
try {
    if (!req.user || !req.user.email) {
        return res.status(401).send("Unauthorized access");
    }
    const email = req.user.email;
    const user = await pool.query(`SELECT * FROM credentials where email = $1`, [email]);
    const displayName = user.rows[0].name;
    return res.render('dashboard', {user : displayName})
} catch (error) {
    console.log("Display Name Error", error);
}

}

const register = async (req,res) => {
    res.render('register')
}

const registerPayload = async (req,res) => {
   const errors =  await formValidationErrors(req);
   if(errors.length > 0){
       return res.render("register", {errors});
   }
   let { name, email, password } = req.body;


   try {
    const existingUser = await pool.query(`SELECT * FROM credentials WHERE email = $1;`, [email]);
    if(existingUser.rows.length > 0){
        return res.render("register", {errors : [{message : "User already exists, Please Login"}]})
    }

    await pool.query(`INSERT into credentials (name,email,password) values ($1,$2,$3);`, [name,email,password]);
    console.log("User registered with credentials : ", {name,email,password});
    return res.redirect("/user/login?message=Success" );
   } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
   }

}

const loginPayLoad = async (req,res) => {
    let {email,password} = req.body;
    try {
        const user = await pool.query(`SELECT * FROM credentials where email = $1;`,[email]);
        console.log(email,password);
        if(user.rows.length===0){
            return res.render("login", {errors  : [{message : "Invalid username or password"}]})
        }
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if(!isMatch){
            return res.render("login", {errors  : [{message : "Invalid username or password"}]});
        }
        console.log("accepted");
        const token = await jwt.sign({id : user.rows[0].id, email: user.rows[0].email},process.env.JWT_SECRET_KEY,{expiresIn:'6h'});

        res.cookie("token",token,{
            httpOnly: true,
            sameSite:"Strict",
            secure:false //set it to true in production
        })
       return res.redirect("/user/dashboard");

    } catch (error) {
        console.log("Database Server Error", error);
        res.status(500).send("Server Error");
    }
}

const logout = async (req,res)=>{
    res.clearCookie("token");
    console.log("Token Cleared, Logged out")
    return res.redirect("/user/login");
}
module.exports  = {login,dashboard,register,registerPayload,loginPayLoad,logout};