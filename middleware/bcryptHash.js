const bcrypt = require('bcryptjs');

const bcryptHash = async (password)=>{
    let hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);
}

module.exports = {bcryptHash};