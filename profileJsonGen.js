const fs = require("fs");
const path = require("path");

async function generateProfilesJson(){
  try{
    // An array of file paths
  const filePaths = [
    path.join(__dirname, "userProvidedData", "names.txt"),
    path.join(__dirname, "userProvidedData", "location.txt"),
    path.join(__dirname, "userProvidedData", "proxy.txt"),
    path.join(__dirname, "userProvidedData", "longitude.txt"),
    path.join(__dirname, "userProvidedData", "latitude.txt"),
  ];

  // An array of promises that read the files
  const fileReadPromises = filePaths.map(path => 
    fs.promises.access(path, fs.constants.R_OK) //checking if files exist and are readable
    .then(() =>  fs.promises.readFile(path, "utf-8"))
    .catch(() => {
      console.error(`Warning: ${path} does not exist or is not readable.`);
      return "";  // Return an empty string instead of failing
    })
);
  
  // Reading all the files concurently using Promises.all
  const fileContents = await Promise.all(fileReadPromises);

// Process each file's content, ensuring empty files return an empty array
const processedData = fileContents.map((fileData) => {
  return fileData
    ? fileData.split("\n").map(line => line.trim()).filter(Boolean)  // Remove empty lines
    : [];  // Handle missing files by returning an empty array
});

  // Destructuring the processedData array
  const [names,locations,proxies,longitudes,latitudes] = processedData;

  // Creating an array of profiles object using the destructed variables from processedData\
  const profiles = [];

  // Calculating total number of profiles
  const totalProfiles = Math.min(
    names.length,
    locations.length,
    proxies.length,
    longitudes.length,
    latitudes.length
  );
  
  // Populating the profiles array from processedData
  for(let i = 0; i < totalProfiles; i++) {
    const [host, port, username, password] = proxies[i].split(":");
    profiles.push({
      name: names[i],
      location: locations[i],
      proxy: { host, port, username, password },
      longitude: longitudes[i],
      latitude: latitudes[i],
    });
  }

  // Writing to profiles.json
  await fs.promises.writeFile(path.join(__dirname, "userProvidedData", "profiles.json"), JSON.stringify(profiles, null, 2), "utf-8");
  console.log(`Saved ${profiles.length} to profiles.json!`);

  } catch(error){
    console.error("Error creating profiles.json ", error);
  }

}

module.exports = generateProfilesJson;