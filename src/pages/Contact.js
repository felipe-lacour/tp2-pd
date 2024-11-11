import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/Sent', { state: { formData } });
    };

    return (
        <div className="contact">
            <section
                className="banners"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/res/img/banner2.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '68vh',
                    color: 'white',
                    display: 'flex',
                }}>
                  
                <h1>How can we<br />help you?</h1>
            </section>

            <section className="contact-container">
                <div className="contact-header">
                    <h2>Get in contact</h2>
                    <p>Send us any questions, issues, or suggestions you may have.</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Name</label>
                        <input
                            type="text"
                            id="nombre"
                            name="name"
                            className="form-control"
                            placeholder="Enter your name..."
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mail">Email</label>
                        <input
                            type="email"
                            id="mail"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email..."
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mensaje">Message</label>
                        <textarea
                            id="mensaje"
                            name="message"
                            className="form-control"
                            rows="4"
                            placeholder="Enter a message..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-submit">Send</button>
                </form>
            </section>
        </div>
    );
};

export default Contact;



