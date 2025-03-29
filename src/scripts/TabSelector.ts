export default function TabSelector(props: number) {
   const canvas = document.getElementById("canvas") as HTMLElement;
   let nowTab = 0;

   console.log(props);

   if (props == 0) {
      if (nowTab == 2) canvas.style.transition = "0.5s";
      canvas.style.left = "0";
   } else if (props == 1) {
      canvas.style.transition = "0.3s";
      canvas.style.left = "-100%";
   } else if (props == 2) {
      if (nowTab == 0) canvas.style.transition = "0.5s";
      canvas.style.left = "-200%";
   }
   nowTab = props;
}
