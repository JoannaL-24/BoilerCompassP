import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import DraggableCourse from "./DraggableCourse/DraggableCourse";
import { Droppable } from "react-beautiful-dnd";
import "./Searchbar.css";
import { debounce } from "lodash";
import { purdueApiUrl } from "models/purdueapi";
import { o } from 'odata';

const Searchbar = ({ parentSearch, updateParentSearch, viewOnly, filterCourses, setFilterCourses, filterName, setFilterName }) => {
  const [results, setResults] = useState([]);
  const activeSearchId = useRef(0);

  useEffect(() => {
    if (filterCourses && filterCourses.length > 0 && filterName) {
      handleSearch(filterName);
    } else {
      setResults([]);
      setFilterName("");
    }
  }, [filterCourses, filterName]);

  const handleSearch = debounce(async (searchInput) => {
    activeSearchId.current += 1; // Increment the ID for each new search
    const currentSearchId = activeSearchId.current;

    const searchString = searchInput.toUpperCase().trim();

    if (searchString === "" && filterCourses.length === 0) {
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
      const courseIds = filterCourses.map(courseId => `Id eq ${courseId}`).join(' or ');
      const courseIdFilter = courseIds ? `(${courseIds})` : "";

      const searchFilters = [];
      if (courseIdFilter) searchFilters.push(courseIdFilter);
      
      const subjectFilter = `startswith(Subject/Abbreviation, '${subject}')`;
      const numberFilter = `startswith(Number, '${number}')`;
      
      if (subject) searchFilters.push(subjectFilter);
      if (number) searchFilters.push(numberFilter);

      const combinedFilters = searchFilters.join(' and ');

      console.log("Combined filters:", combinedFilters);

      const oHandler = o(purdueApiUrl);
      let entities = await oHandler.get("Courses").query({
        $top: 15,
        $orderby: `Number`,
        $expand: `Classes($filter=Campus/Code eq 'PWL';$orderby=Term/Code desc;$top=1),Subject`,
        $filter: combinedFilters,
      });

      if (currentSearchId === activeSearchId.current) {
        // console.log("Entites:", entities);

        // remove entities with no classes
        entities = entities.filter(entity => entity.Classes.length > 0);

        const results = entities.map(entity => ({
          id: entity.Id,
          course: entity.Subject.Abbreviation + " " + entity.Number,
          description: entity.Description,
          credit: entity.CreditHours,
          classId: entity.Classes[0].Id,
          meetings: null,
        }));

        // console.log("Results:", results);
        setResults(results);
        updateParentSearch(results);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, 500);

  return (
    <div className="searchDisplay">
      <div className="filter">
        {/* display filterName text, don't display if none */}
        {/* add an x button to remove filter */}
        {filterName && (
          <>
            <div className="filterName">{filterName}</div>
            <br />
          </>
        )}
      </div>
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
