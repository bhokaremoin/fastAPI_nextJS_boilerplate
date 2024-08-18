'use client'
import {useState} from "react";
import AuthModal from "@/components/AuthModal/AuthModal";
import {Button, Input} from "@nextui-org/react";
import Image from "next/image";
import imagePath from "@/app/imagePath";

interface todoItem {
    id: number;
    name: string;
    isDone: boolean;
}

export default function Home() {
    const [newTodo, setNewTodo] = useState<string>('');
    const [todoList, setTodoList] = useState<todoItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleAddTodo = () => {
        const newItem: todoItem = {
            id: todoList.length,
            name: newTodo,
            isDone: false,
        }
        setTodoList([...todoList, newItem]);
        setNewTodo('');
    }
    const markAsDone = (id: number) => {
        const newArr = todoList;
        newArr.forEach((todo) => {
            if (todo.id === id) {
                todo.isDone = true
            }
        })
        setTodoList([...newArr]);
    }
    const deleteTodo = (id: number) => {
        const newTodo = todoList.filter((todo) => todo.id !== id)
        setTodoList(newTodo);
    }
    return (
        <main className={"w-screen h-screen flex flex-col items-center"}>
            <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-row gap-2"}>
                    <Input type="email" variant={"underlined"} placeholder="Add Todo" value={newTodo}
                           onChange={(e) => setNewTodo(e.target.value)}/>
                    <Button onClick={handleAddTodo}>Add</Button>
                </div>
                <div>
                    {todoList.map((todo, index) => {
                        return <div key={index} className={"flex flex-row gap-2 justify-between"}>
                            <div className={"flex flex-row gap-2"}>
                                {todo.isDone ?
                                    <Image width={20} height={20} src={imagePath.checkedCheckbox} alt={"checkbox"}/> :
                                    <Image width={20} height={20} src={imagePath.checkbox} alt={"checkbox"}
                                           onClick={() => markAsDone(todo.id)}/>}
                                <span>{todo.name}</span></div>
                            <Image width={20} height={20} src={imagePath.delete} alt={"delete"}
                                   onClick={() => deleteTodo(todo.id)}/>
                        </div>
                    })}
                </div>
            </div>
            {/*<div className={"flex flex-col gap-2"}>*/}
            {/*    <span>Dockerized BoilerPlate Template for FullStack Web Application</span>*/}
            {/*    <span>NextJs for Frontend Development</span>*/}
            {/*    <span>FastAPI for Backend Development</span>*/}
            {/*    <span>PostgreSQL for Relational Database</span>*/}
            {/*    <span>Redis for Caching</span>*/}
            {/*</div>*/}
            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
        </main>
    );
}
