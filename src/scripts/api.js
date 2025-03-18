let url = `https://script.google.com/macros/s/AKfycbxrHb3CB2P2fhTsF6YtCggz8pKiu9bJ1NFPF7i6yZ8YGgpt9Djx00G7c3_5pfA-uvqO/exec`;
//let url = `https://script.google.com/macros/s/AKfycbxNCLc3Oww0r65UpTyxfMu2s1_kpnYEiELOKc7YLVyWcrYgS0GpGE1yOOs7OMxuItpzuA/exec`;
export async function fetchData(options) {
   try {
      const response = await fetch(url, options);
      let data = await response.json();
      return data;
   } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
   }
}

export const getSub = async (setFetchedData, setIsFetching) => {
   setIsFetching(true);
   const options = {
      method: "GET",
   };

   try {
      const fetchedData = await fetchData(options);
      setFetchedData(fetchedData);
   } catch (err) {
      console.error(err);
   } finally {
      setIsFetching(false);
   }
};

export const getChange = (setData, setWorkData, homework, setIsFetching, setError) => {
   setIsFetching(true);
   const options = {
      method: "GET",
   };

   fetchData(options)
      .then((fetchedData) => {
         setData(fetchedData[0]);
         setWorkData(fetchedData[1]);
         homework(fetchedData[1]);
         setIsFetching(false);
      })
      .catch((err) => {
         setError("Failed to fetch data");
         console.error(err);
         setIsFetching(false);
      });
};

export const homework = (data, setWorkOpt) => {
   let works = [{ value: "0", label: "0" }];
   let num = 0;

   for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i][1].length; j++) {
         num++;
         works.push({ value: num.toString(), label: num.toString() });
      }
   }

   setWorkOpt(works);
};

export const postChange = (
   mode,
   setIsPosting,
   setIsWorkPosting,
   setError,
   get,
   time,
   sub,
   textWork,
   timeWorkState,
   setTimeWorkState,
   setWorkText
) => {
   let options = {};
   if (mode === 0) {
      setIsPosting(true);
      options = {
         method: "POST",
         body: JSON.stringify({
            date: document.getElementById("datepicker").value,
            time: time,
            value: String(sub + 1),
         }),
      };
   } else if (mode === 1) {
      setIsWorkPosting(true);
      options = {
         method: "POST",
         body: JSON.stringify({
            date: document.getElementById("datepickerWork").value,
            time: 5,
            value: textWork,
         }),
      };
   } else if (mode === 2) {
      setIsWorkPosting(true);
      options = {
         method: "POST",
         body: JSON.stringify({
            date: 0,
            time: 5,
            value: timeWorkState,
         }),
      };
   }

   fetchData(options)
      .then(() => {
         if (mode === 1) {
            setWorkText("");
         } 
         if (mode === 2) {
            setTimeWorkState(0);
         }
         get();
      })
      .catch((err) => {
         setError("Failed to fetch data");
      })
      .finally(() => {
         setIsPosting(false);
         setIsWorkPosting(false);
      });
};
