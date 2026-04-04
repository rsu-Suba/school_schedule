export default function getTodayDate(plus: number = 0, baseDate: Date = new Date()) {
   const today: Date = new Date(baseDate);
   today.setDate(today.getDate() + plus);
   
   const yyyy: number = today.getFullYear();
   const mm: number = today.getMonth() + 1;
   const dd: number = today.getDate();
   const todayText: string = `${yyyy}/${mm}/${dd}`;

   return todayText;
}
