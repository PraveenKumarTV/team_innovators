const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const nodemailer = require('nodemailer');  // Import Nodemailer

const app = express();
const PORT = 3500;
const mongoUrl = 'mongodb://localhost:27017'; // MongoDB connection URL
const dbName = 'event_database';
const eventsCollectionName = 'events';
const registrationsCollectionName = 'registrations'; // Collection for registrations

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public folder
app.use(express.static(path.join(__dirname, 'pdfs'))); // Serve PDF files from pdfs folder

// MongoDB connection
const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
connectToMongo();

// Fetch events from MongoDB
async function fetchEvents() {
    try {
        const db = client.db(dbName);
        const eventsCollection = db.collection(eventsCollectionName);
        const events = await eventsCollection.find().toArray();
        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

// Serve events data as JSON
app.get('/events', async (req, res) => {
    try {
        const events = await fetchEvents();
        res.json(events);
    } catch (error) {
        res.status(500).send('Error fetching events');
    }
});

// Serve the events.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'events.html'));
});

// Setup Nodemailer transporter (using Gmail SMTP as an example)
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services too
    auth: {
        user: 'praveenkumartv@student.tce.edu', // Replace with your email
        pass: 'ilsm zxdk duti lhcg',  // Replace with your email password or app-specific password
    },
});

// Register for an event
app.post('/register', async (req, res) => {
    const { name, id, email, year, branch, contact, eventId } = req.body;
    const registrationData = { name, id, email, year, branch, contact, eventId };

    try {
        const db = client.db(dbName);
        const registrationsCollection = db.collection(registrationsCollectionName);

        // Insert registration data into the registrations collection
        await registrationsCollection.insertOne(registrationData);

        // Compose email content
        const mailOptions = {
            from: 'praveenkumartv@student.tce.edu', // Sender address
            to: email, // Send to the email that the user entered in the form
            subject: `Event Registration Confirmation: Event ID ${eventId}`, // Subject line
            text: `Thank you for registering for the event!
                Here are your registration details:
                Name: ${name}
                ID: ${id}
                Email: ${email}
                Year: ${year}
                Branch: ${branch}
                Contact No: ${contact}
                
                You have successfully registered for the event with Event ID: ${eventId}.
                
                Best regards,
                NSS Event Management Team`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending confirmation email' });
            } else {
                console.log('Confirmation email sent:', info.response);
                return res.json({ message: 'Registration successful! Confirmation email sent.' });
            }
        });

    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ message: 'Error registering for event' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
