export default function getCookie(key) {
   const cookies = document.cookie.split(";");
   const foundCookie = cookies.find((cookie) => cookie.split("=")[0].trim() === key.trim());
   if (foundCookie) {
      const cookieValue = decodeURIComponent(foundCookie.split("=")[1]);
      return cookieValue;
   }
   return "";
}
