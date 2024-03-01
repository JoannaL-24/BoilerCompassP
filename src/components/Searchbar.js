import React, { useState } from 'react'
import TextField from "@mui/material/TextField";
import "./Searchbar.css";
import { debounce } from 'lodash';
import { oHandler } from "models/purdueapi"

const Searchbar = () => {
  const [results, setResults] = useState([]);
  const [matchedEntities, setMatchedEntities] = useState([]);

  const PwlCampusId = "eb70e97b-3583-4ac9-86e5-468ad3869de8"

  const handleSearch = debounce(async (searchInput) => {
    const searchString = searchInput.toUpperCase().trim();

    if (searchString === "") {
      setResults([]);
      return;
    }

    // split into words
    const searchWords = searchString.split(" ");
    let subject = "";
    let number = ""
    // if letters, search for subject
    for (const word of searchWords) {
      if (word.match(/[a-z]/i)) {
        subject = word;
      } else if (word.match(/[0-9]/i)) {
        number = word;
      }
    }

    try {
      const entities = await oHandler.get("Courses").query({
        $expand: `Classes($filter=Campus/Code eq 'PWL'), Subject`,
        $filter: `startswith(Subject/Abbreviation, '${subject}') and startswith(Number, '${number}')`,
      });
      console.log(entities);
      // max length 10

      setMatchedEntities(entities);
      var results = []
      for (const entity of entities.slice(0, 10)) {
        results.push(entity.Subject.Abbreviation + " " + entity.Number);
      }

      setResults(results);
    } catch (error) {
      console.error("Error:", error);
    };

  }, 500);

  return (
    <div className='search&display'>
      <div className="search">
        <TextField
          id="outlined-basic"
          display="flex"
          // justifyContent="center"
          inputProps = {{style: {fontSize: 15}}}
          InputLabelProps={{style: {fontSize: 13}}}
          size = "small" 
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
          style={{ width: 200, height: 5 }}
          label="Search course"
        />
      </div>
      <div>
        {
          results.map((result, index) => (
          <div key={index}>{result}</div>
        ))}
      </div>
    </div>
  )
}

export default Searchbar
