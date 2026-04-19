import React, { useEffect } from 'react';
import './verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
    // 1. Get parameters from the URL (?success=true&orderId=...)
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const { url } = useStore();
    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            // Send verification request to your backend controller
            const response = await axios.post(url + "/api/order/verify", { success, orderId });
            
            if (response.data.success) {
                // If paid, redirect to "My Orders" page
                navigate("/myorders");
            } else {
                // If payment failed, go back to home or cart
                navigate("/");
            }
        } catch (error) {
            console.error("Verification error:", error);
            navigate("/");
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className='verify'>
            <div className="spinner"></div>
            <p>Verifying your payment, please do not close the window...</p>
        </div>
    );
}

export default Verify;
