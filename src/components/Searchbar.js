import React, { useState } from 'react'
import TextField from "@mui/material/TextField";
import SearchList from "./SearchList"
import "./Searchbar.css";
import { firestore as db } from "models/firebase"
import { collection, query, where, getDocs } from 'firebase/firestore';

const Searchbar = () => {
  const [results, setResults] = useState([]);

  const handleSearch = async (searchInput) => {
    const searchString = searchInput.toLowerCase().trim();

    if (searchString === "") {
      setResults([]);
      return;
    }

    const q = query(collection(db, "courseList"), where("Keywords", "array-contains", searchString));
    const querySnapshot = await getDocs(q);
    const searchResults = querySnapshot.docs.map(doc => doc.data().Name);
    setResults(searchResults);
  }

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
          <div key={index}>{result}</div>
        ))}
      </div>
    </div>
  )
}

export default Searchbar
