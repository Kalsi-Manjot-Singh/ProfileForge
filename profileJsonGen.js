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
  const fileReadPromises = filePaths.map(path => fs.promises.readFile(path, "utf-8"));
  
  // Reading all the files concurently using Promises.all
  const fileContents = await Promise.all(fileReadPromises);

  // Processing each files content
  const processedData = fileContents.map((fileData) => {
    return fileData.split("\n").reduce( (acc,line) => {
      const trimmed = line.trim();
      if (trimmed) acc.push(trimmed);
      return acc;
    }, []);
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
    profiles.push({
      name: names[i],
      location: locations[i],
      proxy: proxies[i],
      longitude: longitudes[i],
      latitude: latitudes[i],
    });
  }

  // Writing to profiles.json
  await fs.promises.writeFile("./profiles.json", JSON.stringify(profiles, null, 2), "utf-8");
  console.log("Profiles successfully saved to profiles.json!");

  } catch(error){
    console.error("Error creating profiles.json ", error);
  }

}

generateProfilesJson();