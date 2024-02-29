import React, { useState} from 'react'
import TextField from "@mui/material/TextField";
import SearchList from "./SearchList"
import "./Searchbar.css";
//load from json file, might connect to database in the futrure

const Searchbar = () => {
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (e) => {
        //assume all lower case
        var lowerCase = e.target.value.toLowerCase()
        setSearchInput(lowerCase);
    }
   
  return (
    <div className='search&display'>
        <div className="search">
            <TextField
                id="outlined-basic"
                onChange = {handleSearch}
                variant="outlined"
                style = {{width:200, height:10}}
                label="Search course"
            />
        </div>
        <SearchList input = {searchInput}/>
    </div>
  )
}

export default Searchbar
