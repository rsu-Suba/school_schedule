import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tabselect from "./tabselect";
import "./App.css";

export default function LabelBottomNavigation() {
   const [value, setValue] = React.useState("timetable");

   const handleChange = (event, newValue) => {
      setValue(newValue);
      Tabselect(newValue);
   };

   return (
      <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange} className="bottom">
         <BottomNavigationAction label="Timetable" value="timetable" icon={<ClassOutlinedIcon />} />
         <BottomNavigationAction label="Schedule" value="schedule" icon={<CalendarMonthOutlinedIcon />} />
         <BottomNavigationAction label="Others" value="others" icon={<InfoOutlinedIcon />} />
      </BottomNavigation>
   );
}
