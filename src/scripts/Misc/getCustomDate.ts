export default function getCustomDate(dateText: string, format: string) {
   const date: Date = new Date(dateText);
   const YYYY: number = date.getFullYear();
   const MM: number = date.getMonth() + 1;
   const DD: number = date.getDate();
   const HH: number = date.getHours();
   const mm: number = date.getMinutes();
   let customDate: string = "";

   if (format === "MM/DD") {
      customDate = `${MM}/${DD}`;
   } else if (format === "HHmm") {
      customDate = `${String(HH).padStart(2, "0")}${String(mm).padStart(2, "0")}`;
   } else if (format === "YYYYMMDD") {
      customDate = `${String(YYYY)}${String(MM).padStart(2, "0")}${String(DD).padStart(2, "0")}`;
   }

   return customDate;
}
