const mongoose=require("mongoose");
require("dotenv").config();


exports.dbConnect=()=>{
    const mongoURI = process.env.mongoURI;

  if (!mongoURI) {
    console.error("MONGO_DB_PORT is not defined in the .env file");
    process.exit(1); // Stop the app if Mongo URI is missing
  }
      mongoose.connect(process.env.mongoURI)
  .then(() => {
     console.log("mongo db connected succsfully");
  })
  .catch((err) => console.log(err));
}
     
      