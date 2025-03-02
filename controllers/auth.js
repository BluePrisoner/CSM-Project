
const {formValidationErrors} = require('../middleware/formValidationErrors.js');
const pool = require('../db/dbConnect.js')

const login = async (req,res) => {
    res.render('login');
}

const dashboard = async (req,res) => {
    res.render('dashboard', {user : 'Kiran'});
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
        return res.render("register", {errors : [{message : "User already exits, Please Login"}]})
    }

    await pool.query(`INSERT into credentials (name,email,password) values ($1,$2,$3);`, [name,email,password]);
    console.log("User registered with credentials : ", {name,email,password});
   } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
   }

}
module.exports  = {login,dashboard,register,registerPayload};