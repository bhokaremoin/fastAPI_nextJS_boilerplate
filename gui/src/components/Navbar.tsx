"use client"
import {Button} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {getCookie} from "@/utils/cookies";
import {useGlobalContext} from "@/context/Global";
import {logout} from "@/utils/utils";
import {testAPI} from "@/services/api/authService";

export default function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const {setAuthModalOpen, authModalOpen} = useGlobalContext();
    useEffect(() => {
        const accessToken = getCookie('accessToken');
        if (accessToken) {
            setLoggedIn(true);
        }
    }, [authModalOpen]);

    async function handleTestAPI() {
        try {
            const res = await testAPI();
            if (res) {
                const data = res.data;
                console.log(data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return <div className={"flex flex-row justify-between p-4"}>
        <div className={"flex flex-col"}>
            <span>Simple Todo Application</span>
            <span>A boilerplate codebase for full stack web apps </span>
        </div>
        <Button onClick={handleTestAPI}>test</Button>
        <div>
            {loggedIn ?
                <Button onClick={logout}>logout</Button>
                :
                <Button onClick={() => setAuthModalOpen(true)}>login</Button>
            }
        </div>
    </div>
}