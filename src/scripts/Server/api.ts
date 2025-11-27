import { createClient } from "@supabase/supabase-js";
import type { State, GASArraySubType, GASArrayHWType, GASArrayType } from "@/scripts/Data/type";

const supabaseUrl = "https://nvjtaxpouwjacgtcksvt.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52anRheHBvdXdqYWNndGNrc3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODU1ODksImV4cCI6MjA3NDk2MTU4OX0.mbWi23X6AmdD4MTClKHCo3FAYq8rrjhGNf0MMwOJgiU";
const supabase = createClient(supabaseUrl, supabaseKey);
const table = "Notes";

export const getData = async (
    setSubData?: State<GASArraySubType>,
    setWorkData?: State<GASArrayHWType>,
    homeworkCb?: (d: GASArrayHWType) => void,
    setIsFetching?: State<boolean>,
    setError?: State<string>
): Promise<GASArrayType> => {
    setIsFetching?.(true);
    try {
        const { data, error } = await supabase
            .from(table)
            .select("*")
            .order("date", { ascending: true })
            .order("time", { ascending: true });

        //const data = [[], []];
        //const error = "";

        if (error) throw error;

        const transformed = transformData(data || []);

        setSubData?.(transformed[0]);
        setWorkData?.(transformed[1]);
        homeworkCb?.(transformed[1]);

        return transformed;
    } catch (err) {
        setError?.("Failed to fetch data");
        console.error(err);
        return [[], []];
    } finally {
        setIsFetching?.(false);
    }
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

export const postData = async ({
    mode,
    setIsPosting,
    setIsWorkPosting,
    setError,
    get,
    time,
    sub,
    textWork,
    setWorkText,
    textOther,
    homeworkIdToDelete,
}: {
    mode: number;
    setIsPosting: State<boolean>;
    setIsWorkPosting: State<boolean>;
    setError: State<string>;
    get: () => void;
    time: string;
    sub: string;
    textWork: string;
    setWorkText: State<string>;
    textOther: string;
    homeworkIdToDelete?: number;
}) => {
    try {
        if (mode === 0) {
            setIsPosting(true);
            const datePicker = document.getElementById("datepicker") as HTMLInputElement;
            const date = datePicker.value;
            const value = Number(sub) + 1;

            if (value === 17) {
                await supabase.from(table).delete().eq("date", date).eq("time", Number(time));
            } else {
                const payload = {
                    date: date,
                    time: Number(time),
                    value: value,
                    other_value: value === 16 ? textOther : null,
                };
                await supabase.from(table).upsert(payload, { onConflict: "date, time" });
            }
        } else if (mode === 1) {
            setIsWorkPosting(true);
            const datePicker = document.getElementById("datepickerWork") as HTMLInputElement;
            const payload = { date: datePicker.value, time: 9, value: textWork };
            await supabase.from(table).insert([payload]).select();
            setWorkText("");
        } else if (mode === 2) {
            setIsWorkPosting(true);
            if (!homeworkIdToDelete) return;
            await supabase.from(table).delete().eq("id", homeworkIdToDelete);
        }
        get();
    } catch (err) {
        setError("Failed to post data");
        console.error(err);
    } finally {
        setIsPosting(false);
        setIsWorkPosting(false);
    }
};

function transformData(rows: any[]): GASArrayType {
	const normal: { timestamp: number; time: number; value: number; other_value: string | null }[] = [];
	const work: { id: number; timestamp: number; value: string }[] = [];

	rows.forEach((row) => {
		const timestamp = new Date(row.date).getTime();
		if (row.time !== 9) {
			normal.push({ timestamp, time: row.time, value: Number(row.value), other_value: row.other_value });
		} else {
			work.push({ id: row.id, timestamp, value: row.value });
		}
	});

	return [groupAndFormatNormal(normal), groupAndFormatWork(work)];
}

function groupAndFormatNormal(
	data: { timestamp: number; time: number; value: number; other_value: string | null }[]
): GASArraySubType {
	const map = new Map<number, [number, number, string | null][]>();
	data.forEach((item) => {
		const dayKey = Math.floor(item.timestamp / 86400000) * 86400000;
		if (!map.has(dayKey)) map.set(dayKey, []);
		map.get(dayKey)!.push([item.time, item.value, item.other_value]);
	});
	return Array.from(map.entries())
		.sort((a, b) => a[0] - b[0])
		.map(([date, values]) => [new Date(date).toISOString().slice(0, 10), values]);
}
function groupAndFormatWork(data: { id: number; timestamp: number; value: string }[]): GASArrayHWType {
    const map = new Map<number, [string, number][]>();
    data.forEach((item) => {
        const dayKey = Math.floor(item.timestamp / 86400000) * 86400000;
        if (!map.has(dayKey)) map.set(dayKey, []);
        map.get(dayKey)!.push([item.value, item.id]);
    });
    return Array.from(map.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([date, values]) => [new Date(date).toISOString().slice(0, 10), values]);
}
