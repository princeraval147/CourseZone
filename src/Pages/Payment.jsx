import React, { useState } from 'react'
import axios from 'axios'

const Payment = () => {

    const [responseId, setResponseId] = useState("");
    const [responseState, setResponseState] = useState([]);

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");

            script.src = src;

            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }

            document.body.appendChild(script);
        })
    }

    const createRazorpayOrder = async (amount) => {
        let data = JSON.stringify({
            amount: amount * 100,
            currency: "INR"
        })

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://localhost:5000/orders",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }

        const response = await axios.request(config);
        console.log("Order Data:", response.data);

        // Call function to open Razorpay checkout popup with order details
        await handleRazorpayScreen(response.data);
        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data))
                // handleRazorpayScreen(response.data.amount)
            })
            .catch((error) => {
                console.log("Error at", error)
            })
    }

    const handleRazorpayScreen = async (amount) => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if (!res) {
            alert("Some Error at razorpay Screen Loading")
            return;
        }

        const options = {
            key: "rzp_test_wwpkm13Z4MY1Dv",
            amount: amount,
            currency: "INR",
            name: "Course Zone",
            description: "Payment to Couese Zone",
            image: null,
            handler: function (response) {
                setResponseId(response.razorpay_payment_id)
            },
            profill: {
                name: "Course Zone",
                email: "coursezonebusiness@gmail.com"
            },
            theme: {
                color: "#F4C430"
            }
        }
        const paymentObject = new window.Razorpay(options);
        // Optionally, add an event listener for payment failures
        paymentObject.on("payment.failed", function (response) {
            console.error("Payment failed:", response.error);
            alert("Payment failed. Please try again.");
        });
        paymentObject.open();
    }


    const paymentFetch = (e) => {
        e.preventDefault();

        const paymentId = e.target.paymentId.value;

        axios.get(`http://localhost:5000/payment/${paymentId}`)
            .then((response) => {
                console.log(response.data);
                setResponseState(response.data)
            })
            .catch((error) => {
                console.log("Error", error);
            })
    }

    return (
        <>
            <div className="payment">

                <h1>Payment Gateway</h1>
                <button onClick={() => createRazorpayOrder(100)}>
                    Payment of 100₹
                </button>
                {responseId && <p>{responseId}</p>}

                <h4>This is Payment Verification Form</h4>
                <form onSubmit={paymentFetch}>
                    <input type="text" name='paymentId' />
                    <button type='submit'>Fetch Payment</button>
                    {responseState.length !== 0 && (
                        <ul>
                            <li>Amount : {responseState.amount / 100} Rs.</li>
                            <li>Currency : {responseState.currency}</li>
                            <li>Status : {responseState.status}</li>
                            <li>Method : {responseState.method}</li>
                        </ul>
                    )}
                </form>
            </div>
        </>
    )
}

export default Payment
