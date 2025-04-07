
const pool = require('../db/dbConnect.js');

const renderList = async(req,res) =>{
    try {

        const result  = await pool.query(`
        SELECT c.*, u.*,s.*
         FROM  public.customer c
         JOIN public.user u ON u.user_id = c.user_id
         JOIN  public.subscription s ON c.customer_id = s.customer_id
		 WHERE s.status IN ('active', 'paused');

        `)

        const customers = result.rows;
        res.render('admin/tableList',{customers} ,(err, html) => {
            if (err) {
              console.error("Error rendering plan:", err);
              return res.status(500).send("Internal error");
            }
      
            res.render('adminDashboard', {
              title: 'Admin',
              body: html
            });
          });
    } catch (error) {
        console.error("List Page Error:", error);
    res.status(500).send("Internal Server Error");
    }
}

const deleteCustomer = async(req,res)=>{
  const { customer_id } = req.body;
  try {
    await pool.query('DELETE FROM public.customer WHERE customer_id = $1', [customer_id]);
    res.redirect('/admin/dashboard/list');
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).send('Internal Server Error');
  }

}
const renderComplaints = async(req,res) =>{
    try {
        res.render('admin/complaints', (err, html) => {
            if (err) {
              console.error("Error rendering plan:", err);
              return res.status(500).send("Internal error");
            }
      
            res.render('adminDashboard', {
              title: 'Admin',
              body: html
            });
          });
    } catch (error) {
        console.error("Complaints Page Error:", error);
    res.status(500).send("Internal Server Error");
    }
}

module.exports = {renderList,renderComplaints};