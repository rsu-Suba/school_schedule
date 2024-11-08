import { React, useState } from "react";
import { Drawer, Button } from "antd";
import Other from "./other.jsx";
import AppsIcon from "@mui/icons-material/Apps";

export default function AnchorTemporaryDrawer() {
   const [open, setOpen] = useState(false);
   const showDrawer = () => {
      setOpen(true);
   };
   const onClose = () => {
      setOpen(false);
   };

   return (
      <div>
         <Button type="primary" onClick={showDrawer} className="menubutton">
            <AppsIcon></AppsIcon>
         </Button>

         <Drawer onClose={onClose} open={open}>
            <Other/>
         </Drawer>
      </div>
   );
}
