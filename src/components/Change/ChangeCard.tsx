import "dayjs/locale/ja";
import { Dayjs } from "dayjs";
import { times_Array, subsListOpt_Array, subsList_Array } from "@/scripts/Data/DataPack";
import { CardBase, CardInside, LoadSkeleton } from "@/components/Layout/CardComp";
import { ChangeList, ChangeListMapper, NoData, ErrorData } from "@/components/Change/ChangeComp";
import ChangeController from "@/components/Change/ChangeController";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import useContexts from "@/scripts/Data/Contexts";
import type {
   State,
   GASArraySubMapType,
   GASArrayHWMapType,
   GASArraySubType,
   GASArrayHWType,
} from "@/scripts/Data/type";

type ChangeCardType = {
   card: string;
   date: Dayjs;
   setDate: State<Dayjs>;
   time: number;
   setTime: State<number>;
   isPosting: boolean;
   postMode: number;
   data: GASArraySubType | GASArrayHWType;
   isFetching: boolean;
   post: (mode: number) => void;
   get: () => void;
   sub?: number;
   setSub?: State<number>;
   timeOptions?: { value: string; label: string }[];
   showInput?: boolean;
   textValue?: string;
   setTextValue?: State<string>;
   error: string;
};

export default function ChangeCard({
   card,
   date,
   setDate,
   time,
   setTime,
   isPosting,
   postMode,
   data,
   isFetching,
   post,
   get,
   sub,
   setSub,
   timeOptions,
   showInput,
   textValue,
   setTextValue,
   error,
}: ChangeCardType) {
   const times: { value: string; label: string }[] = times_Array;
   const subsListOpt: { value: string; label: string }[] = subsListOpt_Array;
   const subsList: string[] = subsList_Array;
   const { CardTitleContexts, CardInsideContexts } = useContexts();
   const changeControllerProps = {
      dateId: card === CardTitleContexts.ChangeInteg_SC ? "datepicker" : "datepickerWork",
      date: date,
      setDate: setDate,
      timeValue: time,
      handleChangeTime: (e: number) => setTime(e),
      isFetching: isFetching,
      isPosting: isPosting,
      postMode: postMode,
      post: post,
      get: get,
      timeOptions: card === CardTitleContexts.ChangeInteg_SC ? times : timeOptions,
      showInput: showInput,
      textValue: textValue,
      setTextValue: setTextValue,
      subjectValue: card === CardTitleContexts.ChangeInteg_SC ? subsList[sub!] : null,
      subjectOptions: card === CardTitleContexts.ChangeInteg_SC ? subsListOpt : null,
      handleChangeSubject: card === CardTitleContexts.ChangeInteg_SC ? (e: string) => setSub!(Number(e) - 1) : null,
   };

   return (
      <CardBase title={card}>
         <div className="cardChanged" id="card">
            <ChangeController {...changeControllerProps} />
            <div>
               {isFetching ? (
                  <CardInside>
                     <LoadSkeleton />
                  </CardInside>
               ) : error ? (
                  <ErrorData error={CardInsideContexts.FailedFetch} />
               ) : data[0] ? (
                  <div>
                     {data.map((date: GASArraySubMapType | GASArrayHWMapType) => (
                        <ChangeList>
                           <p className="scheText">{getCustomDate(date[0], "MM/DD")}</p>
                           <ChangeListMapper mode={card} data={date[1]} />
                        </ChangeList>
                     ))}
                  </div>
               ) : (
                  <NoData />
               )}
            </div>
         </div>
      </CardBase>
   );
}
