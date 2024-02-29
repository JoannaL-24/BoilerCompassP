import React from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function DraggableCourse() {
  return (
    <Draggable>
      <Card
        style={{
          width: "150px",
          height: "100px",
        }}
      >
        <CardContent>Course</CardContent>
      </Card>
    </Draggable>
  );
}

export default DraggableCourse;
