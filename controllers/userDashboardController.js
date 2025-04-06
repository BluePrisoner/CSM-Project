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
  const renderSubPage = async (req, res) => {
    try {
      const email = req.user.email;
  
      // Fetch all plans (active, paused, inactive) for the logged-in user
      const result = await pool.query(`
        SELECT s.*, c.fname, c.lname
        FROM public.subscription s
        JOIN public.customer c ON s.customer_id = c.customer_id
        JOIN public.user u ON c.user_id = u.user_id
        WHERE u.email = $1
        AND s.status IN ('active', 'paused', 'inactive');
      `, [email]);
  
      const subscriptions = result.rows;
      const displayName = subscriptions.length > 0 ? `${subscriptions[0].fname} ${subscriptions[0].lname}` : 'User';
      res.locals.user = displayName;
  
      // Render inner page and inject into dashboard
      res.render('user/subscription', { subscriptions }, (err, html) => {
        if (err) {
          console.error("Error rendering plan:", err);
          return res.status(500).send("Internal error");
        }
  
        res.render('dashboard', {
          title: 'Subscription',
          body: html
        });
      });
  
    } catch (error) {
      console.error("Plan Page Error:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  
  const renderRechargePage = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT provider_name, plan_type, price_rate
        FROM plan_details
      `);
  
      const planDetails = result.rows;
  
      res.render('user/recharge', { planDetails }, (err, html) => {
        if (err) {
          console.error("Error rendering recharge page:", err);
          return res.status(500).send("Internal error");
        }
  
        res.render('dashboard', {
          title: 'Recharge',
          body: html
        });
      });
  
    } catch (error) {
      console.error("Recharge Page Error:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  const handleRecharge = async (req, res) => {
    const { plan_type, days, provider_name } = req.body;
    console.log(req.user);
    const user_email = req.user.email; // Email from req.user
  
    try {
      // Step 1: Get customer info via email
      const custQuery = `
        SELECT c.customer_id
        FROM public.customer c
        JOIN public.user u ON c.user_id = u.user_id
        WHERE u.email = $1
      `;
      const custResult = await pool.query(custQuery, [user_email]);
  
      if (custResult.rowCount === 0) {
        return res.status(404).send("Customer not found");
      }
  
      const customer_id = custResult.rows[0].customer_id;
  
      // Step 2: Get price_rate from plan_details
      const priceQuery = `
        SELECT price_rate 
        FROM plan_details 
        WHERE plan_type = $1 AND provider_name = $2
      `;
      const priceResult = await pool.query(priceQuery, [plan_type, provider_name]);
  
      if (priceResult.rowCount === 0) {
        return res.status(400).send("Plan or provider not found");
      }
  
      const price_rate = parseFloat(priceResult.rows[0].price_rate);
      const total_price = price_rate * parseInt(days);
  
      // Step 3: Insert into subscription table
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + parseInt(days));
  
      const insertSubscription = `
        INSERT INTO subscription (customer_id, plan_type, provider_name, start_date, end_date,status)
        VALUES ($1, $2, $3, $4, $5,$6)
      `;
      await pool.query(insertSubscription, [customer_id, plan_type, provider_name, startDate, endDate, 'active']);
  
      // Step 4: Insert into billing table
      const insertBilling = `
        INSERT INTO billing (customer_id, provider_name, bill_date, amount,status)
        VALUES ($1, $2, CURRENT_DATE, $3,$4)
      `;
      await pool.query(insertBilling, [customer_id, provider_name, total_price,'success']);
  
      res.redirect('/user/dashboard?flash=Recharge successful!');
    } catch (error) {
      console.error("Recharge error:", error);
      res.status(500).send("Recharge failed.");
    }
  };


  
  
  
  

module.exports = { renderPlanPage,updatePlanStatus,renderSubPage,renderRechargePage,handleRecharge };
