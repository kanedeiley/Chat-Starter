const express = require('express');
const router = express.Router();

// GET /chat route - for basic testing
router.get('/', (req, res) => {
  res.json({ reply: "This is an example express call" });
});

// POST /chat with messages array
router.post('/', (req, res) => {
  // Extract messages array from request body
  const messages = req.body.messages || [];
  
  // Log received messages (for debugging)
  console.log('Received messages:', messages);
  
  // Process the messages - here you could implement more complex logic
  // This example just looks at the last user message
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
  const userContent = lastUserMessage ? lastUserMessage.content : '';
  
  // Generate a response
  res.json({ 
    reply: `Received ${messages.length} messages. Last user message: "${userContent}"`,
    // You can add more data here if needed
  });
});

module.exports = router;