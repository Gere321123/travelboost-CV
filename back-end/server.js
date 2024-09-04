const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Load environment variables from .env file
require('dotenv').config();

// OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Function to get the access token
async function getAccessToken() {
  try {
    const res = await oauth2Client.getAccessToken();
    return res.token;
  } catch (error) {
    console.error('Error getting access token', error);
    throw error;
  }
}

// Configure a new Nodemailer transporter with OAuth2 authentication
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'info.travelboost@gmail.com',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: getAccessToken()
  }
});

app.post('/sendtravelboost', async (req, res) => {
  const { userEmail, agencyName } = req.body;
  const mailOptions = {
    from: 'info.travelboost@gmail.com',
    to: 'gergely.gere@gmail.com',
    subject: 'New Agency Request',
    text: `Szép nap ez a mai bővűlt a csapat ${agencyName}, ${userEmail} szeretne csatlakozni`
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully:', result);
    res.status(200).send('Notification email sent successfully.');
  } catch (error) {
    console.error('Error sending notification email:', error.message);
    res.status(500).send('Failed to send notification email.');
  }
});

// Error handling for Node.js server startup
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Global error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Additional error handling steps if necessary
});
