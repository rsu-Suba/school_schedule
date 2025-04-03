import type { State, GASArraySubType, GASArrayHWType, GASArrayType } from "@/scripts/Data/type";
//import { DataArrayDev } from "../../../Dev/apiDev";

const url: string = `https://script.google.com/macros/s/AKfycbxrHb3CB2P2fhTsF6YtCggz8pKiu9bJ1NFPF7i6yZ8YGgpt9Djx00G7c3_5pfA-uvqO/exec`;
//const url: string = `https://script.google.com/macros/s/AKfycbxNCLc3Oww0r65UpTyxfMu2s1_kpnYEiELOKc7YLVyWcrYgS0GpGE1yOOs7OMxuItpzuA/exec`;

export async function fetchData(options: RequestInit) {
   try {
      const response = await fetch(url, options);
      let data: GASArrayType = await response.json();
      //const data = DataArrayDev;
      return data;
   } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
   }
}

export const getSub = async (setFetchedData: State<GASArrayType>, setIsFetching: State<boolean>) => {
   setIsFetching(true);
   const options: RequestInit = {
      method: "GET",
   };

   try {
      const fetchedData: GASArrayType = await fetchData(options);
      setFetchedData(fetchedData);
   } catch (err) {
      console.error(err);
   } finally {
      setIsFetching(false);
   }
};

export const getChange = (
   setData: State<GASArraySubType>,
   setWorkData: State<GASArrayHWType>,
   homework: (d: GASArrayHWType) => void,
   setIsFetching: State<boolean>,
   setError: State<string>
) => {
   setIsFetching(true);
   const options: RequestInit = {
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

export const homework = (data: GASArrayHWType, setWorkOpt: State<{ value: string; label: string }[]>) => {
   let works: { value: string; label: string }[] = [{ value: "0", label: "0" }];
   let num: number = 0;

   for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i][1].length; j++) {
         num++;
         works.push({ value: num.toString(), label: num.toString() });
      }
   }

   setWorkOpt(works);
};

export const postChange = (
   mode: number,
   setIsPosting: State<boolean>,
   setIsWorkPosting: State<boolean>,
   setError: State<string>,
   get: () => void,
   time: string,
   sub: string,
   textWork: string,
   timeWorkState: string,
   setTimeWorkState: State<string>,
   setWorkText: State<string>
) => {
   let options: RequestInit = {};
   if (mode === 0) {
      setIsPosting(true);
      const datePicker = document.getElementById("datepicker") as HTMLInputElement;
      options = {
         method: "POST",
         body: JSON.stringify({
            date: datePicker.value,
            time: time,
            value: String(Number(sub) + 1),
         }),
      };
   } else if (mode === 1) {
      setIsWorkPosting(true);
      const datePicker = document.getElementById("datepickerWork") as HTMLInputElement;
      options = {
         method: "POST",
         body: JSON.stringify({
            date: datePicker.value,
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
            setTimeWorkState("0");
         }
         get();
      })
      .catch((err) => {
         setError("Failed to fetch data");
         console.log(err);
      })
      .finally(() => {
         setIsPosting(false);
         setIsWorkPosting(false);
      });
};
