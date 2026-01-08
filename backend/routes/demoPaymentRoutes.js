// backend/routes/demoPaymentRoutes.js
const express = require("express");
const router = express.Router();

// Only enable in development
if (process.env.NODE_ENV !== "development") {
  module.exports = router;
  return;
}

/**
 * Demo Opay payment page
 * Simulates the Opay payment interface
 */
router.get("/opay/pay", (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).send("Reference is required");
  }

  // Simple HTML page that simulates Opay payment
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Demo Opay Payment</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .payment-box {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #0a5d00;
          text-align: center;
        }
        .info {
          margin: 20px 0;
          padding: 15px;
          background: #e8f5e9;
          border-radius: 5px;
        }
        button {
          width: 100%;
          padding: 15px;
          background: #0a5d00;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          margin: 10px 0;
        }
        button:hover {
          background: #085200;
        }
        button.cancel {
          background: #dc3545;
        }
        button.cancel:hover {
          background: #c82333;
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo h2 {
          color: #0a5d00;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="payment-box">
        <div class="logo">
          <h2>🅾️ OPAY</h2>
          <p style="margin: 0; color: #666;">Demo Payment Page</p>
        </div>
        
        <h1>Complete Payment</h1>
        
        <div class="info">
          <p><strong>Reference:</strong> ${reference}</p>
          <p><strong>Status:</strong> <span id="status">Pending</span></p>
          <p style="font-size: 12px; color: #666; margin-top: 10px;">
            ℹ️ This is a simulated payment page for development testing.
          </p>
        </div>
        
        <button onclick="completePayment()">✓ Pay with Demo Card</button>
        <button class="cancel" onclick="cancelPayment()">✗ Cancel Payment</button>
      </div>

      <script>
        function completePayment() {
          document.getElementById('status').textContent = 'Processing...';
          
          // Simulate payment processing delay
          setTimeout(() => {
            document.getElementById('status').textContent = 'Success!';
            
            // Redirect back to frontend with reference
            const returnUrl = 'http://localhost:5173/payment/callback?reference=${reference}&status=success';
            window.location.href = returnUrl;
          }, 2000);
        }

        function cancelPayment() {
          const returnUrl = 'http://localhost:5173/payment/callback?reference=${reference}&status=cancelled';
          window.location.href = returnUrl;
        }
      </script>
    </body>
    </html>
  `);
});

/**
 * Health check for demo routes
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Demo payment routes active",
    env: process.env.NODE_ENV,
  });
});

module.exports = router;
