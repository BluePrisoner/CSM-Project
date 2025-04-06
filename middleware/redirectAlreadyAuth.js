const redirectIfAuthenticated = async (req,res,next) => {
    if(req.cookies.token){
        return res.redirect('/user/dashboard');
    }
    next();
}
const redirectIfAuthenticatedAdmin = async (req,res,next) => {
    if(req.cookies.token){
        return res.redirect('/admin/dashboard');
    }
    next();
}

module.exports = {redirectIfAuthenticated,redirectIfAuthenticatedAdmin};