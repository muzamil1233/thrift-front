import { BASE_URL } from "../../api/baseUrl";

const useRazorpay = () => {

  const handlePayment = async (amount, userDetails) => {
    try {
      // Step 1: Create order from backend
      const res = await fetch(`${BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }), // convert ₹ to paise
      });

      const order = await res.json();

      // Step 2: Open Razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
        amount: order.amount,
        currency: order.currency,
        name: "Your App Name",
        description: "Payment",
        order_id: order.id,
 
        // Step 3: After payment success
        handler: async (response) => {
          const verifyRes = await fetch(`${BASE_URL}/api/payment/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("✅ Payment Successful!");
          } else {
            alert("❌ Payment Verification Failed!");
          }
        },

        // Prefill user details
        prefill: {
          name: userDetails?.name || "",
          email: userDetails?.email || "",
          contact: userDetails?.phone || "",
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failure
      rzp.on("payment.failed", (response) => {
        alert("Payment Failed: " + response.error.description);
      });

      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong!");
    }
  };

  return { handlePayment };
};

export default useRazorpay;