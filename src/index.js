require('dotenv').config(); // Allows reading .env file

const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', (req, res) => {
  // All twilio request attributes
  const {
    SmsMessageSid,
    NumMedia,
    SmsSid,
    SmsStatus,
    Body,
    To,
    NumSegments,
    MessageSid,
    AccountSid,
    From,
    ApiVersion,
  } = req.body;

  const { MessagingResponse } = twilio.twiml;
  const response = new MessagingResponse();
  const message = response.message();

  switch(Body) {
    case 'image':
      message.media('http://i.ytimg.com/vi/oHg5SJYRHA0/hqdefault.jpg');
      message.body('Here\'s an awesome dude!');
      break;
    case 'delay':
      message.body('You\'ll receive another message in 3 seconds');
      setTimeout(() => {
        client.messages.create({
          from: To, // From twilio
          to: From, // To the sender
          body: 'An awesome answer sent without you asking for it!',
        }).then(() => console.log('Delayed message sent!'));
      }, 3000);
      break;
    default:
      message.body(`You wrote: ${Body}`);
      break;
  }

  // Send back response
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(response.toString());
});

app.listen(process.env.PORT,() => {
  console.log('Running');
});
