const bcrypt = require('bcryptjs');

const bcryptHash = async (password)=>{
    let hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
}

module.exports = {bcryptHash};