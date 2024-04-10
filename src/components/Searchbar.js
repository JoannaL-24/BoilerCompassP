import React, { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import DraggableCourse from "./DraggableCourse/DraggableCourse";
import { Droppable } from "react-beautiful-dnd";
import "./Searchbar.css";
import { debounce } from "lodash";
import { purdueApiUrl } from "models/purdueapi";
import { o } from 'odata';

const Searchbar = ({ parentSearch, updateParentSearch, viewOnly }) => {
  const [results, setResults] = useState([]);
  const activeSearchId = useRef(0);

  const handleSearch = debounce(async (searchInput) => {
    activeSearchId.current += 1; // Increment the ID for each new search
    const currentSearchId = activeSearchId.current;

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
    console.log("Subject:", subject);
    console.log("Number:", number);

    if (currentSearchId !== activeSearchId.current) return;

    try {
      const oHandler = o(purdueApiUrl);
      let entities = await oHandler.get("Courses").query({
        $top: 10,
        $orderby: `Number`,
        $expand: `Classes($filter=Campus/Code eq 'PWL';$orderby=Term/Code desc;$top=1),Subject`,
        $filter: `startswith(Subject/Abbreviation, '${subject}') and startswith(Number, '${number}')`,
      });

      // Before updating the state, check if this is still the active request
      if (currentSearchId === activeSearchId.current) {
        console.log("Entites:", entities);

        // remove entities with no classes
        entities = entities.filter(entity => entity.Classes.length > 0);

        const results = entities.map(entity => ({
          id: entity.Id,
          course: entity.Subject.Abbreviation + " " + entity.Number,
          description: entity.Description,
          credit: entity.CreditHours,
          classId: entity.Classes[0].Id,
          meetings: undefined,
        }));

        console.log("Results:", results);
        setResults(results);
        updateParentSearch(results);
      }
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
              <DraggableCourse
                key={index}
                index={index}

                id={result.id}
                course={result.course}
                description={result.description}
                credit={result.credit}
                classId={result.classId}
                meetings={result.meetings}
                viewOnly={viewOnly}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable >
    </div >
  );
};

export default Searchbar;
