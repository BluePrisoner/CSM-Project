const pool = require('../db/dbConnect.js');

const setUserDisplayName = async (req, res, next) => {
  try {
    const email = req.user.email;
    const userData = await pool.query(`
      SELECT c.*
      FROM public.customer c
      JOIN public.user u ON c.user_id = u.user_id
      WHERE u.email = $1;
    `, [email]);

    res.locals.user = userData.rows[0].fname + ' ' + userData.rows[0].lname;
    next();
  } catch (error) {
    console.error("Error setting user display name:", error);
    res.status(500).send("Internal error");
  }
};

module.exports = {setUserDisplayName};
