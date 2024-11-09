import { React, useState } from "react";
import { Drawer, Button } from "antd";
import Other from "./other.jsx";
import AppsIcon from "@mui/icons-material/Apps";

export default function AnchorTemporaryDrawer(props) {
   const [open, setOpen] = useState(false);
   const showDrawer = () => {
      setOpen(true);
   };
   const onClose = () => {
      setOpen(false);
   };
   
   const darkcall = (data) => {
    props.handleValueChange(data);
 };

   return (
      <div>
         <Button type="primary" onClick={showDrawer} className="menubutton">
            <AppsIcon></AppsIcon>
         </Button>

         <Drawer onClose={onClose} open={open}>
            <Other  handleValueChange={darkcall} dark={props.dark}/>
         </Drawer>
      </div>
   );
}
