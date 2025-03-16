
const {bcryptHash} = require('./bcryptHash.js');

const formValidationErrors = async (req)=> {
    
    let{fname,email,password,password2,phone,address} = req.body;
    console.log({
        fname,email,password,password2
    });

    let errors = [];

    const phone_num = String(Math.abs(phone));

    if(!fname || !email || !password || !password2){
        errors.push({message : "Please enter all fields"});
    }

    if(password.length < 6){
        errors.push({message : "Password must be greater than 5 Characters"});
    }
    if(password != password2){
        errors.push({message : "Confirm password doesnot match"});
    }
    if(phone_num.length !== 10){
        errors.push({message : "Phone number must be 10 digits"});
    }

    if(address.length < 10){
        errors.push({message : "Enter valid address"});
    }

    if(errors.length > 0){
        return errors; 
    }   


    
    req.body.password =  await bcryptHash(password);
    

    return [];
}    

module.exports = {formValidationErrors};