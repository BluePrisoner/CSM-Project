
const {bcryptHash} = require('./bcryptHash.js');

const formValidationErrors = async (req,res)=> {
    
    let{name,email,password,password2} = req.body;
    console.log({
        name,email,password,password2
    });

    let errors = [];

    if(!name || !email || !password || !password2){
        errors.push({message : "Please enter all fields"});
    }

    if(password.length < 6){
        errors.push({message : "Password must be greater than 5 Characters"});
    }
    if(password != password2){
        errors.push({message : "Confirm password doesnot match"});
    }

    if(errors.length > 0){
        res.render('register', {errors})
    }else{
        bcryptHash(password);
    }
}    

module.exports = {formValidationErrors};