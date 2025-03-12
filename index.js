// External library imports
const axios = require("axios");
const express = require("express");
const generateProfilesJson = require("./profileJsonGen"); // Import function

const app = express();
const PORT = 3000; // Port for the server to listen to.

// Middleware
app.use(express.json()); 
app.use((req, res, next) => {
  console.log(` ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Run profile generation before server starts
(async () => {
  await generateProfilesJson();
})();

// Routes
app.get("/profiles", async (req, res) => {
  try {
    const apiResponse = await axios.get(
      "http://localhost:50325/api/v1/user/list?page=1&page_size=50"
    );
    res.status(200).json(apiResponse.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profiles", code: "API error" });
    console.error(`API error: ${err.message}`);
  }
});

// Handling unsupported methods
app.all("/profiles", (req, res) => {
  res.status(405).json({ error: "Method not allowed", code: 405 });
});

// Handling undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", code: 404 });
});

app.listen(PORT, () => console.log("Server listening on port 3000..."));