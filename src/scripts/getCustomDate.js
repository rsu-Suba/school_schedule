export default function getCustomDate(dateText, format) {
   const date = new Date(dateText);
   const YYYY = date.getFullYear();
   const MM = date.getMonth() + 1;
   const DD = date.getDate();
   const HH = date.getHours();
   const mm = date.getMinutes();
   let customDate = "";

   if (format === "MM/DD") {
      customDate = `${MM}/${DD}`;
   } else if (format === "HHmm") {
      customDate = `${String(HH).padStart(2, "0")}${String(mm).padStart(2, "0")}`;
   } else if (format === "YYYYMMDD") {
      customDate = `${String(YYYY)}${String(MM).padStart(2, "0")}${String(DD).padStart(2, "0")}`;
   }

   return customDate;
}
