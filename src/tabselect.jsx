import "./App.css";

let nowTab = 0;

function App(props) {
   console.log(props);
   const canvas = document.getElementById("canvas");

   if (props == "timetable") {
      if (nowTab == 2) canvas.style.transition = "0.5s";
      nowTab = 0;
      canvas.style.left = "0";
   } else if (props == "schedule") {
      nowTab = 1;
      canvas.style.transition = "0.3s";
      canvas.style.left = "-100%";
   } else if (props == "others") {
      if (nowTab == 0) canvas.style.transition = "0.5s";
      nowTab = 2;
      canvas.style.left = "-200%";
   }
}

export default App;
