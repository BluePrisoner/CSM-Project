const login = async (req,res) => {
    res.status(200).send('Fake login');
}

const dashboard = async (req,res) => {
    res.status(200).send('Dashboard');
}
module.exports  = {login,dashboard};