import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import DraggableCourse from "./DraggableCourse";
import { Draggable, Droppable } from "react-beautiful-dnd";
import "./Searchbar.css";
import { debounce } from "lodash";
import { oHandler } from "models/purdueapi";

const Searchbar = () => {
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
      for (const entity of entities.slice(0, 10)) {
        results.push(entity.Subject.Abbreviation + " " + entity.Number);
      }
      setResults(results);
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
          style={{ width: 200, height: 5 }}
          label="Search course"
        />
      </div>
      <Droppable droppableId="ROOT">
        {(provided) => (
          <div className="searchResults" {...provided.droppableProps} ref={provided.innerRef}>
            {/* {results.map((result, index) => (
              <Draggable
                draggableId={index}
                index={index}
              >
                {(provided) => {
                  <div
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                  >
                    {result}
                  </div>
                }}
              </Draggable>
            ))} */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Searchbar;
