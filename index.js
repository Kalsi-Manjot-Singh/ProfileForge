// External library imports
const axios = require("axios");
const express = require("express");

const app = express();
const PORT = 3000; // Port for the server to listen to.

app.use(express.json()); // middleware to parse req body
// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/profiles", async (req, res)=>{
  try {
    const apiResponse = await axios.get("http://localhost:50325/api/v1/user/list?page=1&page_size=50")
    res.status(200).json(apiResponse.data);
  } catch(err) {
      res.status(500).json({error: "Failed to fetch profiles"});
      console.error(`API error: ${err.message}`);
    }
})

// Handling unsupported methods
app.all("/profiles", (req,res)=>{
  res.status(405).json({error: "Method not allowed"});
})

// Handling undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, ()=> console.log("Server listening on port 3000..."));