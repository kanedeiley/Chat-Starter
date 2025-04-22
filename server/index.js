const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Import routes
const chatRoutes = require('./routes/chat');

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the chat router for /chat routes
app.use('/chat', chatRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Express Chat API Server');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Chat API available at http://localhost:${PORT}/chat`);
});