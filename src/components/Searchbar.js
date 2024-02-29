import React, { useState } from 'react'
import TextField from "@mui/material/TextField";
import "./Searchbar.css";
import { firestore as db } from "models/firebase"
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { debounce } from 'lodash';

const Searchbar = () => {
  const [results, setResults] = useState([]);

  const PwlCampusId = "eb70e97b-3583-4ac9-86e5-468ad3869de8"

  const handleSearch = debounce(async (searchInput) => {
    // const searchString = searchInput.toUpperCase().trim();

    // if (searchString === "") {
    //   setResults([]);
    //   return;
    // }

    // const q = query(
    //   collection(db, "courseList"),
    //   where("Keywords", "array-contains", searchString),
    //   orderBy("Name"),
    //   limit(10)
    // );
    // const querySnapshot = await getDocs(q);
    // let results = []
    // querySnapshot.forEach((doc) => {
    //   results.push({ Name: doc.data().Name, Id: doc.id });
    // });
    // setResults(results);
  }, 500);

  return (
    <div className='search&display'>
      <div className="search">
        <TextField
          id="outlined-basic"
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
          style={{ width: 200, height: 10 }}
          label="Search course"
        />
      </div>
      <div>
        {results.map((result, index) => (
          <div key={index}>{result.Name}</div>
        ))}
      </div>
    </div>
  )
}

export default Searchbar
