// fetchData.js
export async function fetchData(url, options) {
   try {
      const response = await fetch(url, options);
      let data = await response.json();
      return data;
   } catch (error) {
       console.error("Error fetching data:", error);
       throw error; // 必要に応じてエラーを再スローする
   }
 }