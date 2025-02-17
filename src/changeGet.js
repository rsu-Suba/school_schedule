// fetchData.js
let url = `https://script.google.com/macros/s/AKfycbxrHb3CB2P2fhTsF6YtCggz8pKiu9bJ1NFPF7i6yZ8YGgpt9Djx00G7c3_5pfA-uvqO/exec`;
//let url = `https://script.google.com/macros/s/AKfycbxNCLc3Oww0r65UpTyxfMu2s1_kpnYEiELOKc7YLVyWcrYgS0GpGE1yOOs7OMxuItpzuA/exec`;
export async function fetchData(options) {
   try {
      const response = await fetch(url, options);
      let data = await response.json();
      return data;
   } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // 必要に応じてエラーを再スローする
   }
}
