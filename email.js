const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(cors());
app.use(bodyParser.json());

// POST endpoint to accept parameters from request body
app.post('/application', (req, res) => {
    const { from, to, subject, html } = req.body;

    if (!from || !to || !subject || !html) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const curlCommand = `curl -X POST 'https://api.resend.com/emails' \
    -H 'Authorization: Bearer re_e7PaC1h3_GmmVbnDASc3NSKJCuGVEmaBq' \
    -H 'Content-Type: application/json' \
    -d '{
      "from": "${from}",
      "to": "${to}",
      "subject": "${subject}",
      "html": "${html}"
    }'`;

    // Execute the cURL command
    exec(curlCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing cURL: ${error}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log(`cURL response: ${stdout}`);
        res.status(200).json({ message: 'Email sent successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
