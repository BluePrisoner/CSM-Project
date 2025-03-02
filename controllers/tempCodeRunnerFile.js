let { name, email, password } = req.body;

   try {
    const existingUser = await pool.query(`SELECT * FROM credentials WHERE email = $1`, [email]);
    if(existingUser.rows.length > 0){
        return res.render("register", {errors : [{message : "User already exits, Login"}]})
    }

    await pool.query(`INSERT into credentials (name,email,password) values ($1,$2,$3)`, [name,email,password]);
    console.log("User registered with credentials : ", {name,email,password});
   } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
   }