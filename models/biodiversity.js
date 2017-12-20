const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const biodiversitySchema = new Schema({
    "County": { type: String, required: false },
    "Category": { type: String, required: true },
    "Taxonomic Group": { type: String, required: false },
    "Taxonomic Subgroup": { type: String, required: false },
    "Scientific Name": { type: String, required: false },
    "Common Name": { type: String, required: true },
    "Year Last Documented": { type: String, required: false },
    "NY Listing Status": { type: String, required: false },
    "State Conservation Rank": { type: String, required: false },
    "Global Conservation Rank": { type: String, required: false },
    "Distribution Status": { type: String, required: false },
  },
  {
    collection: 'biodiversity'
  }
);

  const Biodiversity = mongoose.model("Biodiversity", biodiversitySchema);
  
  module.exports = Biodiversity;