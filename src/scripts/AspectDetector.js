import { useState, useEffect } from "react";

export default function AspectDetector() {
   const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);

   useEffect(() => {
      const handleResize = () => {
         const newAspectRatio = window.innerWidth / window.innerHeight;
         setAspectRatio(newAspectRatio);
      };

      window.addEventListener("resize", handleResize);
      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []);

   return aspectRatio;
}
