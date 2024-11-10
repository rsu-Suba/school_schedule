import React from "react";
export default function Swipe(props) {
   const minimumDistance = 30;
   window.onload = function () {
      let canvas = document.querySelector("#canvas");
      let startX = 0;
      let startY = 0;
      let endX = 0;
      let endY = 0;

      canvas.addEventListener("touchstart", (e) => {
         startX = e.touches[0].pageX;
         startY = e.touches[0].pageY;
      });

      canvas.addEventListener("touchmove", (e) => {
         endX = e.changedTouches[0].pageX;
         endY = e.changedTouches[0].pageY;
      });
      const change = (data) => {
         props.handleValueChange(data);
      };

      canvas.addEventListener("touchend", (e) => {
         const distanceX = endX - startX;
         const distanceY = Math.abs(endY - startY);

         if (Math.abs(distanceX) > distanceY && Math.abs(distanceX) > minimumDistance) {
            if (distanceX > 0) {
               change(-1);
            } else if (distanceX < 0) {
               change(1);
            }
         }
      });
   };

   return <></>;
}
