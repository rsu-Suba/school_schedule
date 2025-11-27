import { Space } from "antd";
import { DateInput, InputSelector, ButtonPair } from "@/components/Change/ChangeComp";
import { CardInside } from "@/components/Layout/CardComp";
import { useData } from "@/contexts/DataContext";
import { times_Array, subsListOpt_Array, subsList_Array } from "@/scripts/Data/DataPack";

export default function ChangeController({
    isSC,
    postMode,
    timeOptions,
    showInput,
}: {
    isSC: boolean;
    postMode: number;
    timeOptions: { value: string; label: string }[];
    showInput: boolean;
}) {
    const {
        change: { date, setDate, time, setTime, sub, setSub, textOther, setOtherText },
        work: { dateWork, setDateWork, timeWorkState, setTimeWorkState, textWork, setWorkText },
        api: { isLoading, isPosting, isWorkPosting },
    } = useData();

    const times = times_Array;
    const subsListOpt = subsListOpt_Array;
    const subsList = subsList_Array;

    const dateInputProps = {
        dateId: isSC ? "datepicker" : "datepickerWork",
        date: isSC ? date : dateWork,
        setDate: isSC ? setDate : setDateWork,
        timeValue: isSC ? time : timeWorkState,
        handleChangeTime: (e: string) => (isSC ? setTime(e) : setTimeWorkState(e)),
        timeOptions: isSC ? times : timeOptions,
    };

    const inputSelectorProps = {
        subjectOptions: isSC ? subsListOpt : null,
        subjectValue: isSC ? subsList[Number(sub)] : null,
        handleChangeSubject: isSC ? (e: string) => setSub((Number(e) - 1).toString()) : null,
        showInput: showInput,
        textValue: isSC ? "" : textWork,
        setTextValue: setWorkText,
        otherValue: textOther,
        setOtherValue: setOtherText,
    };

    const buttonPairProps = {
        isFetching: isLoading,
        isPosting: isSC ? isPosting : isWorkPosting,
        postMode: postMode,
        showInput: showInput,
    };

    return (
        <CardInside className="ChangeController">
            <Space direction="vertical" className="changeSpace1">
                <DateInput {...dateInputProps} />
                <InputSelector {...inputSelectorProps} />
                <ButtonPair {...buttonPairProps} />
            </Space>
        </CardInside>
    );
}
