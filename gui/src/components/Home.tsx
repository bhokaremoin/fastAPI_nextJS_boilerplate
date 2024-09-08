'use client'

import React, {KeyboardEvent, useCallback, useEffect, useState} from "react";
import {Button, Input} from "@nextui-org/react";
import Image from "next/image";
import AuthModal from "@/components/AuthModal/AuthModal";
import imagePath from "@/app/imagePath";
import {useGlobalContext} from "@/context/Global";
import {TodoItem} from "@/types/todo";
import {createTodo, deleteTodo, getTodos, updateTodo} from "@/services/api/todoService";
import {getCookie} from "@/utils/cookies";

const Home: React.FC = () => {
    const [newTodo, setNewTodo] = useState<string>('');
    const [todoList, setTodoList] = useState<TodoItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {authModalOpen, setAuthModalOpen} = useGlobalContext();
    const [loggedIn, setLoggedIn] = useState(false);

    const fetchTodos = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getTodos();
            setTodoList(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        } finally {
            setIsLoading(false);
        }

    }, []);


    useEffect(() => {
        const accessToken = getCookie('accessToken');
        console.log("out")
        if (accessToken) {
            fetchTodos().then();
            setLoggedIn(true);
            console.log("hit");
        }
    }, [fetchTodos, authModalOpen]);

    const handleAddTodo = useCallback(async () => {
        if (newTodo.trim() === '') return;
        if (!loggedIn) {
            setAuthModalOpen(true);
            return;
        }
        try {
            const response = await createTodo({title: newTodo.trim()});
            setTodoList(prevList => [...prevList, response.data]);
            setNewTodo('');
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    }, [newTodo, loggedIn]);

    const markAsDone = useCallback(async (id: string) => {
        try {
            const response = await updateTodo(id, {is_done: true});
            setTodoList(prevList =>
                prevList.map(todo =>
                    todo._id === id ? response.data : todo
                )
            );
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    }, []);

    const deleteTodoItem = useCallback(async (id: string) => {
        try {
            await deleteTodo(id);
            setTodoList(prevList => prevList.filter(todo => todo._id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddTodo().then();
        }
    }, [handleAddTodo]);

    return (
        <main className="w-screen h-[75vh] flex flex-col items-center justify-between">
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                    <Input
                        type="text"
                        variant="underlined"
                        placeholder="Add Todo"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button onClick={handleAddTodo}>Add</Button>
                </div>
                <div>
                    {isLoading ? (
                        <p>Loading todos...</p>
                    ) : (
                        todoList.map((todo) => (
                            <TodoItemComponent
                                key={todo._id}
                                todo={todo}
                                onMarkDone={markAsDone}
                                onDelete={deleteTodoItem}
                            />
                        ))
                    )}
                </div>
            </div>
            <div className={"flex flex-col gap-2"}>
                <span>Dockerized BoilerPlate Template for FullStack Web Application</span>
                <span>NextJs for Frontend Development</span>
                <span>FastAPI for Backend Development</span>
                <span>PostgreSQL for Relational Database</span>
                <span>Redis for Caching</span>
            </div>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)}/>
        </main>
    );
};

interface TodoItemProps {
    key: string;
    todo: TodoItem;
    onMarkDone: (id: string) => void;
    onDelete: (id: string) => void;
}

const TodoItemComponent: React.FC<TodoItemProps> = React.memo(({todo, onMarkDone, onDelete}) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            key={todo._id}
            className="flex flex-row gap-2 justify-between items-center p-2 hover:bg-gray-100 rounded"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-row gap-2 items-center">
                <Image
                    width={20}
                    height={20}
                    src={todo.is_done ? imagePath.checkedCheckbox : imagePath.checkbox}
                    alt="checkbox"
                    onClick={() => !todo.is_done && onMarkDone(todo._id)}
                    className="cursor-pointer"
                />
                <span className={todo.is_done ? "line-through text-gray-500" : ""}>{todo.title}</span>
            </div>
            {isHovered && (
                <Image
                    width={20}
                    height={20}
                    src={imagePath.delete}
                    alt="delete"
                    onClick={() => onDelete(todo._id)}
                    className="cursor-pointer"
                />
            )}
        </div>
    );
});

TodoItemComponent.displayName = 'TodoItem';

export default Home;
