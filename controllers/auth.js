
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
const adminLogin = async (req,res) => {

    const message =  req.query.message;
    if(!message){
        return res.render('adminLogin');
    }
    res.render('adminLogin', {errors : [{message : message}]});
}

const adminDashboard = async (req,res)=> {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).send("Unauthorized access");
        }
        return res.render('adminDashboard');
    } catch (error) {
        console.log(error);
    }
}

const dashboard = async (req,res) => {

    
try {
    if (!req.user || !req.user.email) {
        return res.status(401).send("Unauthorized access");
    }
    const email = req.user.email;
    const user = await pool.query(`SELECT c.*
                                    FROM public.customer c
                                    JOIN public.user u ON c.user_id = u.user_id
                                    WHERE u.email = $1;`, [email]);
    const displayName = user.rows[0].fname + ' ' + user.rows[0].lname;
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
   let { fname,lname, email, password,provider_name,phone,address } = req.body;

   const phone_num = String(phone);


   try {
    const existingUser = await pool.query(`SELECT u.*
                                            FROM public.user u
                                            LEFT JOIN public.customer c ON u.user_id = c.user_id
                                            WHERE u.email = $1 OR c.phone = $2;`, [email,phone_num]);
    if(existingUser.rows.length > 0){
        return res.render("register", {errors : [{message : "User already exists, Please Login"}]})
    }

    const newUser = await pool.query(`INSERT INTO public.user (email, password) VALUES ($1, $2) RETURNING user_id`, [email,password]);

    const userId = newUser.rows[0].user_id;

    await pool.query(
        `INSERT INTO public.customer (user_id, fname,lname, phone, provider_name,address) VALUES ($1, $2, $3, $4, $5, $6);`, 
        [userId, fname,lname, phone_num, provider_name,address]
    );

    console.log("User registered with credentials : ", {email,password});
    return res.redirect("/user/login?message=Success" );
   } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
   }

}

const loginPayLoad = async (req,res) => {
    let {email,password} = req.body;
    try {
        const user = await pool.query(`SELECT * FROM public.user where email = $1;`,[email]);
        console.log(email,password);
        if(user.rows.length===0){
            return res.json({ success: false, message: "Invalid username or password" });

        }
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if(!isMatch){
            return  res.json({ success: false, message: "Invalid username or password" });

        }
        console.log("accepted");
        const token = await jwt.sign({id : user.rows[0].id, email: user.rows[0].email},process.env.JWT_SECRET_KEY,{expiresIn:'6h'});

        res.cookie("token",token,{
            httpOnly: true,
            sameSite:"Strict",
            secure:false //set it to true in production
        })
       return res.json({success : true});

    } catch (error) {
        console.log("Database Server Error", error);
        res.status(500).send("Server Error");
    }
}

const adminLoginPayload = async (req,res)=>{
    let {email,password} = req.body;
    try {
        const user = await pool.query(`SELECT * FROM public.user where email = $1 and role = 'admin';`,[email]);
        console.log(email,password);
        if(user.rows.length===0){
            return res.json({ success: false, message: "Invalid username or password" });

        }
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if(!isMatch){
            return  res.json({ success: false, message: "Invalid username or password" });

        }
        console.log("accepted");
        const token = await jwt.sign({id : user.rows[0].id, email: user.rows[0].email},process.env.JWT_SECRET_KEY,{expiresIn:'6h'});

        res.cookie("token",token,{
            httpOnly: true,
            sameSite:"Strict",
            secure:false //set it to true in production
        })
       return res.json({success : true});

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

const logoutAdmin = async (req,res)=>{
    res.clearCookie("token");
    console.log("Token Cleared, Logged out")
    return res.redirect("/admin/login");
}
module.exports  = {login,dashboard,register,registerPayload,loginPayLoad,logout,adminLogin,adminLoginPayload,adminDashboard,logoutAdmin};