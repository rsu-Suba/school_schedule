import { useState } from "react";
import { Drawer, Button } from "antd";
import Other from "@/components/Layout/other.tsx";
import AppsIcon from "@mui/icons-material/Apps";

export default function MenuDrawer() {
   const [open, setOpen] = useState(false);

   return (
      <div>
         <Button type="primary" onClick={() => setOpen(true)} className="menubutton">
            <AppsIcon />
         </Button>

         <Drawer onClose={() => setOpen(false)} open={open}>
            <Other/>
         </Drawer>
      </div>
   );
}
