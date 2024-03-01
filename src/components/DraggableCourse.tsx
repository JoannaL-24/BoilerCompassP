import React from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

type DraggableCourseProps = {
  course: string;
};

const DraggableCourse: React.FC<DraggableCourseProps> = ({ course }) => {
  return (
    <Draggable>
      <Card
        style={{
          width: "150px",
          height: "100px",
        }}
      >
        <CardContent>{course}</CardContent>
      </Card>
    </Draggable>
  );
};

export default DraggableCourse;
