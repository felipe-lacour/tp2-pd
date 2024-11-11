import './Sent.css';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Sent = () => {
    const location = useLocation();
    const { formData } = location.state || {};

    return (
        <div className="sent-page">
            <h2>Thank you for contacting us!</h2>
            <p className='info-sub'>Here's the information you submitted:</p>
            <div>
                <p><strong>Name:</strong> {formData?.name}</p>
                <p><strong>Email:</strong> {formData?.email}</p>
                <p className='message'><strong>Message:</strong> {formData?.message}</p>
            </div>
        </div>
    );
};

export default Sent;
