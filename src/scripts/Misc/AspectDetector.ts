import { useState, useEffect } from "react";

export default function AspectDetector() {
   const [aspectRatio, setAspectRatio] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         const newAspectRatio: number = window.innerHeight / window.innerWidth;
         setAspectRatio(newAspectRatio > 1);
      };

      handleResize();

      window.addEventListener("resize", handleResize);
      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []);

   return aspectRatio;
}
