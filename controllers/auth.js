
const {formValidationErrors} = require('../middleware/formValidationErrors.js');

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
    formValidationErrors(req,res);
    //Form Validation is successfull
    
}
module.exports  = {login,dashboard,register,registerPayload};