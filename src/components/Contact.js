import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './raju.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_4vpv12e', 'template_gqq91ae', e.target, '2e0LyoNBnkCYOWUEL')
            .then((result) => {
                console.log(result.text);
                alert('Message sent successfully!');
            }, (error) => {
                console.log(error.text);
                alert('An error occurred, please try again.');
            });

        e.target.reset();
    };

    return (
        <div className="contact-page">
            {/* Banner */}
            <div className="banner">
                <div className="container">
                    <h1>Contact Us</h1>
                    <nav>
                        <Link to="/">Dashboard</Link> / Contact
                    </nav>
                </div>
            </div>

            {/* Contact Section */}
            <div className="contact-section">
                <div className="container">
                    <div className="contact-info">
                        <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <h3>Address</h3>
                            <p>Saket, New Delhi, India</p>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <h3>Email</h3>
                            <p><a href="mailto:bhukyarahuldev@gmail.com">rahul@gmail.com</a></p>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-phone-alt"></i>
                            <h3>Phone</h3>
                            <p>+91 9640XX8846</p>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <h3>About Me</h3>
                            <p><a href='https://rahuldev252.github.io/My-portfolio/index.html'>My Portfolio</a> </p>
                        </div>
                    </div>

                    <div className="contact-form">
                        <h2>Get in Touch</h2>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Name" 
                                required 
                                onChange={handleChange}
                            />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email" 
                                required 
                                onChange={handleChange}
                            />
                            <textarea 
                                name="message" 
                                placeholder="Message" 
                                required 
                                onChange={handleChange}
                            ></textarea>
                            <button type="submit">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
