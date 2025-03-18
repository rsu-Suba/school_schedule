export default function getTodayDate(plus = 0) {
   const today = new Date();
   const yyyy = today.getFullYear();
   const mm = today.getMonth() + 1;
   const dd = today.getDate() + plus;
   const todayText = `${yyyy}/${mm}/${dd}`;

   return todayText;
}
