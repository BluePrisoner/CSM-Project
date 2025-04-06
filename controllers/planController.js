const pool = require('../db/dbConnect.js'); // adjust this path based on your project structure

const renderPlanPage = async (req, res) => {
  try {
    const email = req.user.email;

    // Fetch active plan for the logged-in user
    const result = await pool.query(`
      SELECT s.*, c.fname, c.lname
    FROM public.subscription s
    JOIN public.customer c ON s.customer_id = c.customer_id
    JOIN public.user u ON c.user_id = u.user_id
    WHERE u.email = $1
    AND s.status IN ('active', 'paused');

    `, [email]);

    const plan = result.rows[0] || null;

    const displayName = plan ? `${plan.fname} ${plan.lname}` : 'User';
    res.locals.user = displayName;

    res.render('user/plan', { plan }, (err, html) => {
      if (err) {
        console.error("Error rendering plan:", err);
        return res.status(500).send("Internal error");
      }

      res.render('dashboard', {
        title: 'Plan',
        body: html
      });
    });

  } catch (error) {
    console.error("Plan Page Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
const updatePlanStatus = async (req, res) => {
    try {
      const { subscription_id, status } = req.body;
  
      // Get current plan data
      const result = await pool.query(
        'SELECT status, pause_start_date, end_date FROM subscription WHERE subscription_id = $1',
        [subscription_id]
      );
  
      if (!result.rows.length) {
        return res.status(404).send("Subscription not found");
      }
  
      const currentPlan = result.rows[0];
      const currentDate = new Date();
  
      if (status === 'paused' && currentPlan.status !== 'paused') {
        // Save the date when paused
        await pool.query(
          'UPDATE subscription SET status = $1, pause_start_date = $2 WHERE subscription_id = $3',
          [status, currentDate, subscription_id]
        );
  
      } else if (status === 'active' && currentPlan.status === 'paused') {
        // Resuming from pause
        const pauseStartDate = new Date(currentPlan.pause_start_date);
        const timePaused = Math.floor((currentDate - pauseStartDate) / (1000 * 60 * 60 * 24)); // in days
  
        // Extend end_date
        const newEndDate = new Date(currentPlan.end_date);
        newEndDate.setDate(newEndDate.getDate() + timePaused);
  
        await pool.query(
          'UPDATE subscription SET status = $1, pause_start_date = NULL, end_date = $2 WHERE subscription_id = $3',
          [status, newEndDate, subscription_id]
        );
      } else {
        // If status didn’t actually change or switching between same status
        await pool.query(
          'UPDATE subscription SET status = $1 WHERE subscription_id = $2',
          [status, subscription_id]
        );
      }
  
      res.redirect('/user/dashboard/plan');
    } catch (error) {
      console.error("Error updating plan status:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  

module.exports = { renderPlanPage,updatePlanStatus };
