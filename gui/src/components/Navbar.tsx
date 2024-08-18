"use client"
import {Button} from "@nextui-org/react";

export default function Navbar() {
    return <div className={"flex flex-row justify-between p-4"}>
        <div className={"flex flex-col"}><span>Simple Todo Application</span>
            <span>A boilerplate codebase for full stack web apps </span></div>
        <div><Button>Save</Button></div>
    </div>
}