


const login = async (req,res) => {
    res.render('login');
}

const dashboard = async (req,res) => {
    res.render('dashboard', {user : 'Kiran'});
}

const register = async (req,res) => {
    res.render('register')
}
module.exports  = {login,dashboard,register};