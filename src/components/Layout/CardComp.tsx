import React from "react";
import { List, Avatar, Skeleton } from "antd";
import jsonData from "@/assets/main.json";
import IconProvider from "@/components/Misc/iconProvider";
import type { jsonType } from "@/scripts/Data/type";

const jsonSub: jsonType = jsonData.sub;

function CardBase(props: { title: string; children: React.ReactNode }) {
    return (
        <div className="carddiv">
            <CardTitle title={props.title} />
            {props.children}
        </div>
    );
}

function CardTitle(props: { title: string }) {
    return (
        <div className="cardTitle">
            <p>
                <span style={{ color: "var(--main-color)" }}>{props.title.slice(0, 1)}</span>
                <span>{props.title.slice(1)}</span>
            </p>
        </div>
    );
}

function LoadSkeleton(props: { className?: string }) {
    return (
        <List className={`${props.className}`}>
            <List.Item>
                <Skeleton active round paragraph={{ rows: 2 }} title={false} />
            </List.Item>
        </List>
    );
}

function SubList(props: { SubNumber?: number; children: React.ReactNode }) {
    let link: React.ReactNode = [];
    if (props.SubNumber != undefined) {
        if (jsonSub[props.SubNumber].syllabus !== "") {
            link = <a className="linkButton" href={jsonSub[props.SubNumber].syllabus} target="_blank"></a>;
        }
    }

    return (
        <List>
            <List.Item>{props.children}</List.Item>
            {link}
        </List>
    );
}

function CardInside(props: { className?: string; children: React.ReactNode }) {
    return (
        <div className={`card ${props.className || ""}`} id="card">
            {props.children}
        </div>
    );
}

function SubIcon(props: { SubNumber: number }) {
    return (
        <Avatar>
            <IconProvider icon={jsonSub[props.SubNumber].icon} />
        </Avatar>
    );
}

function Divider() {
    return <div className="scheList"></div>;
}

export { CardBase, CardInside, LoadSkeleton, SubList, SubIcon, Divider };
