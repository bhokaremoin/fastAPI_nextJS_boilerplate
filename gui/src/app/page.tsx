'use client'
import {useState} from "react";
import AuthModal from "@/components/AuthModal";

export default function Home() {
    const [newTodo, setNewTodo] = useState<string>('');
    const handleAddTodo = () => {
        console.log(newTodo);
    }
    return (
        <main className={"w-screen h-screen flex flex-col justify-center items-center"}>
            <AuthModal/>
            <div className={"flex flex-col gap-4"}>
                <span>Simple ToDo Application</span>
                <span>To Implement a CRUD application</span>
                <div className={"flex flex-col"}>
                    <div><input type={"text"} className={"border-none text-black"} value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}/>
                        <button onClick={handleAddTodo}>Add</button>
                    </div>
                    <div></div>
                </div>
            </div>
            <div className={"flex flex-col gap-2"}>
                <span>Dockerized BoilerPlate Template for FullStack Web Application</span>
                <span>NextJs for Frontend Development</span>
                <span>FastAPI for Backend Development</span>
                <span>PostgreSQL for Relational Database</span>
                <span>Redis for Caching</span>
            </div>
        </main>
    );
}
