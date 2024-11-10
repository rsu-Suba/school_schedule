import "./App.css";

let nowTab = 0;

function App(props) {
   const canvas = document.getElementById("canvas");

   if (props == 0) {
      if (nowTab == 2) canvas.style.transition = "0.5s";
      nowTab = 0;
      canvas.style.left = "0";
   } else if (props == 1) {
      nowTab = 1;
      canvas.style.transition = "0.3s";
      canvas.style.left = "-100%";
   } else if (props == 2) {
      if (nowTab == 0) canvas.style.transition = "0.5s";
      nowTab = 2;
      canvas.style.left = "-200%";
   }
}

export default App;
