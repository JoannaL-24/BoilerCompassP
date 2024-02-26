import React, { useState} from 'react'
import TextField from "@mui/material/TextField";
import SearchList from "./SearchList"
import "./Searchbar.css";
//load from json file, might connect to database in the futrure

const Searchbar = () => {
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (e) => {
        //assume all lower case
        setSearchInput(e.target.value.toLowercase());
    }
    if (searchInput.length > 0) {
        courseList.filter((course) =>{
            return course.name.match(searchInput);
        })
    }
  return (
    <div className='search&display'>
        <div className="search">
            <input
            type = "text"
            placeholder = "Search courses"
            onchange = {handleSearch}
            value = {searchInput}/>

            <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            label="Search"
            />
        </div>
    </div>
  )
}

export default Searchbar
