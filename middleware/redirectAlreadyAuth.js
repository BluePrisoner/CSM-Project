const redirectIfAuthenticated = async (req,res,next) => {
    if(req.cookies.token){
        return res.redirect('/user/dashboard');
    }
    next();
}

module.exports = {redirectIfAuthenticated};