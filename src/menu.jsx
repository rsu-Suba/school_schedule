import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import AppsIcon from "@mui/icons-material/Apps";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Other from "./other.jsx";

export default function AnchorTemporaryDrawer() {
   const [state, setState] = React.useState({
      top: false,
      left: false,
      bottom: false,
      right: false,
   });

   const toggleDrawer = (anchor, open) => (event) => {
      if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
         return;
      }

      setState({ ...state, [anchor]: open });
   };

   const list = (anchor) => (
      <Box
         sx={{ width: 500 }}
         role="presentation"
         className="othersMenu"
         id="others"
      >
         <div className="otherCards">
            <Other />
         </div>
      </Box>
   );

   return (
      <div>
         <React.Fragment key="right">
            <Button variant="contained" onClick={toggleDrawer("right", true)} className="menubutton">
               <AppsIcon></AppsIcon>
            </Button>
            <Drawer anchor="right" open={state["right"]} onClose={toggleDrawer("right", false)}>
               {list("right")}
            </Drawer>
         </React.Fragment>
      </div>
   );
}
