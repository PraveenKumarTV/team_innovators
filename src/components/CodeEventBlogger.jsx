// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import '../style/codeEventBlogger.css'; // Ensure you have a CSS file for styling

const CodeEventBlogger = () => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [contactDetails, setContactDetails] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventData = {
            eventName,
            eventDate,
            contactDetails,
        };

        try {
            const response = await fetch('http://localhost:5000/create-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                setResponseMessage('Event created successfully!');
                // Clear the form fields
                setEventName("");
                setEventDate("");
                setContactDetails("");
            } else {
                setResponseMessage('Failed to create event.');
            }
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('Error creating event.');
        }
    };

    return (
        <div className="event-blogger-container">
            <h2 className="blog-title">Create an Event</h2>
            <form className="blog-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="blog-input"
                    placeholder="Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                />
                <input
                    type="date"
                    className="blog-input"
                    placeholder="Event Date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="blog-input"
                    placeholder="Contact Details"
                    value={contactDetails}
                    onChange={(e) => setContactDetails(e.target.value)}
                    required
                />
                <button type="submit" className="blog-submit-btn">Create Event</button>
            </form>

            {responseMessage && (
                <div className="response-message">
                    <h3>{responseMessage}</h3>
                </div>
            )}
        </div>
    );
};

export default CodeEventBlogger;
