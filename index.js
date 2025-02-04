const http = require("http");
const axios = require("axios");

const server = http.createServer( async (req,res)=>{ 
  if(req.url === "/profiles" && req.method === "GET") {
    try {
      res.writeHead(200, { "Content-Type": "application/json"});
      const apiResponse = await axios.get("http://localhost:50325/api/v1/user/list?page=1&page_size=50")
      res.end(JSON.stringify(apiResponse.data));
    } catch(err) {
        res.writeHead(500, { "Content-Type": "application/json"});
        res.end(JSON.stringify({error: "Failed to fetch profiles", details: err.message}));
      }
    }
    else {
      res.writeHead(404, { "Content-Type": "text/plain"});
      res.write("Route not found");
      res.end();
    }
})
const port = 3000;
server.listen(port);
console.log("Server listening on port 3000...")