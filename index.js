const axios = require("axios");

axios.get("http://localhost:50325/api/v1/user/list")
  .then(response => console.log(response.data))
  .catch(err => console.log("Error: ", err));
