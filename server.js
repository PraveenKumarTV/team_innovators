/* eslint-disable no-undef */
import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import { MongoClient } from 'mongodb';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// MongoDB connection
const uri = 'mongodb://localhost:27017/event_database'; // Change this to your MongoDB connection string
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db('event_database'); // Replace with your desired database name
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connectDB();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to send email
app.post('/send-email', (req, res) => {
    const { to_email, image_data } = req.body;

    if (!to_email || !image_data) {
        return res.status(400).send('Missing email or image data');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com', // Replace with your email
            pass: 'your_password', // Replace with your email password
        },
    });

    const mailOptions = {
        from: 'your_email@gmail.com', // Replace with your email
        to: to_email,
        subject: 'Your Captured Image with Custom Text',
        html: '<h3>Here is your photo with the custom text!</h3>',
        attachments: [
            {
                filename: 'custom-image.png',
                content: image_data.split('base64,')[1],
                encoding: 'base64',
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Failed to send email');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Email sent successfully');
    });
});

// Route to create an event
app.post('/create-event', async (req, res) => {
    const { eventName, eventDate, contactDetails } = req.body;

    // Log incoming request body
    console.log('Incoming request:', req.body);

    if (!eventName || !eventDate || !contactDetails) {
        return res.status(400).send('Missing event name, date, or contact details');
    }

    try {
        const newEvent = {
            eventName,
            eventDate: new Date(eventDate), // Ensure date is in the correct format
            contactDetails,
        };

        const result = await db.collection('events').insertOne(newEvent);
        console.log('Event created:', result);
        res.status(200).send('Event created successfully');
    } catch (error) {
        console.error('Error saving event:', error);
        res.status(500).send('Failed to create event');
    }
});

// Route to create a blog post
app.post('/create-post', upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    const image = req.file;

    if (!title || !content || !image) {
        return res.status(400).send('Missing title, content, or image');
    }

    console.log(`Title: ${title}, Content: ${content}, Image: ${image.path}`);

    res.status(200).send('Blog post created successfully');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
