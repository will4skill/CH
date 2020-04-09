const express = require('express');
const app = express();
const cors = require('cors');
const conversation_handler = require('./routes/conversation_handler.js');

app.use(cors());
app.use(express.json());
app.use('/api/conversation-handler', conversation_handler);


const port = process.env.PORT || 4001;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
