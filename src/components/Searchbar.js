import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import DraggableCourse from "./DraggableCourse/DraggableCourse";
import { Droppable } from "react-beautiful-dnd";
import "./Searchbar.css";
import { debounce } from "lodash";
import { oHandler } from "models/purdueapi";

const Searchbar = ({parentSearch, updateParentSearch}) => {
  const [results, setResults] = useState([]);
  const [matchedEntities, setMatchedEntities] = useState([]);
  

  const handleSearch = debounce(async (searchInput) => {
    const searchString = searchInput.toUpperCase().trim();

    if (searchString === "") {
      setResults([]);
      return;
    }

    // split into words
    const searchWords = searchString.split(" ");
    let subject = "";
    let number = "";
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

      // max length 10
      setMatchedEntities(entities);
      var results = [];
      let result;
      for (const entity of entities.slice(0, 10)) {
        result = {
          id: entity.Id,
          number: entity.Subject.Abbreviation + " " + entity.Number,
          description: entity.Description,
          credit: entity.CreditHours
        };
        results.push(result);
      }
      console.log(results);
      setResults(results);
      updateParentSearch(results);
    } catch (error) {
      console.error("Error:", error);
    }
  }, 500);

  return (
    <div className="searchDisplay">
      <div className="search">
        <TextField
          id="outlined-basic"
          display="flex"
          inputProps={{ style: { fontSize: 15 } }}
          InputLabelProps={{ style: { fontSize: 13 } }}
          size="small"
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
          style={{ width: 200 }}
          label="Search course"
        />
      </div>
      <Droppable droppableId="ROOT">
        {(provided) => (
          <div className="searchResults" {...provided.droppableProps} ref={provided.innerRef}>
            {results.map((result, index) => (
              <DraggableCourse key={index} index={index} course={result.number} id={result.id} description={result.description} credit={result.credit} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable >
    </div >
  );
};

export default Searchbar;
