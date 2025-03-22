function getCookie(key: string) {
   const cookies: string[] = document.cookie.split(";");
   const foundCookie: string | undefined = cookies.find((cookie) => cookie.split("=")[0].trim() === key.trim());
   if (foundCookie) {
      const cookieValue: string | number | boolean = decodeURIComponent(foundCookie.split("=")[1]);
      return cookieValue;
   }
   return "";
}

function postCookie(key: string, value: string | number | boolean) {
   document.cookie = `${key}=${value}`;
}

export { getCookie, postCookie };
