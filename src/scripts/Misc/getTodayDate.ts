export default function getTodayDate(plus: number = 0) {
   const today: Date = new Date();
   const yyyy: number = today.getFullYear();
   const mm: number = today.getMonth() + 1;
   const dd: number = today.getDate() + plus;
   const todayText: string = `${yyyy}/${mm}/${dd}`;

   return todayText;
}
