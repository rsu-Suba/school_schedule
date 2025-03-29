import { Space } from "antd";
import { Dayjs } from "dayjs";
import { DateInput, InputSelector, ButtonPair } from "@/components/Change/ChangeComp";
import { CardInside } from "@/components/Layout/CardComp";
import type { State } from "@/scripts/Data/type";

type ChangeControllerType = {
   dateId: string;
   date: Dayjs;
   setDate: State<Dayjs>;
   timeValue: number;
   handleChangeTime: (e: number) => void;
   timeOptions: { value: string; label: string }[] | undefined;
   showInput?: boolean;
   textValue?: string;
   setTextValue?: State<string>;
   subjectValue: string | null;
   subjectOptions: { value: string; label: string }[] | null;
   handleChangeSubject: ((e: string) => void) | null;
   isFetching: boolean;
   isPosting: boolean;
   postMode: number;
   post: (mode: number) => void;
   get: () => void;
};

export default function ChangeController({
   dateId,
   date,
   setDate,
   timeValue,
   handleChangeTime,
   isFetching,
   isPosting,
   postMode,
   post,
   get,
   timeOptions,
   showInput,
   textValue,
   setTextValue,
   subjectValue,
   subjectOptions,
   handleChangeSubject,
}: ChangeControllerType) {
   return (
      <CardInside className="ChangeController">
         <Space direction="vertical" className="changeSpace1">
            <DateInput
               dateId={dateId}
               date={date}
               setDate={setDate}
               timeValue={timeValue}
               handleChangeTime={handleChangeTime}
               timeOptions={timeOptions!}
            />
            <InputSelector
               subjectOptions={subjectOptions}
               subjectValue={subjectValue}
               handleChangeSubject={handleChangeSubject}
               showInput={showInput!}
               textValue={textValue!}
               setTextValue={setTextValue!}
            />
            <ButtonPair
               isFetching={isFetching}
               isPosting={isPosting}
               postMode={postMode}
               post={post}
               get={get}
               showInput={showInput!}
            />
         </Space>
      </CardInside>
   );
}
