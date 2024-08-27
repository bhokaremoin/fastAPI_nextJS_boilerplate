'use client'

import React, {KeyboardEvent, useCallback, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {Button, Input} from "@nextui-org/react";
import Image from "next/image";
import AuthModal from "@/components/AuthModal/AuthModal";
import imagePath from "@/app/imagePath";
import {useGlobalContext} from "@/context/Global";

interface TodoItem {
    id: number;
    name: string;
    isDone: boolean;
}

interface CustomAlertProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({message, onConfirm, onCancel}) => {
    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <p className="mb-4">{message}</p>
                <div className="flex justify-end space-x-2">
                    <Button color="primary" onClick={onConfirm}>Save Todos</Button>
                    <Button color="danger" onClick={onCancel}>Cancel</Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const Home: React.FC = () => {
    const [newTodo, setNewTodo] = useState<string>('');
    const [todoList, setTodoList] = useState<TodoItem[]>([]);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const {authModalOpen, setAuthModalOpen} = useGlobalContext();

    const handleAddTodo = useCallback(() => {
        if (newTodo.trim() === '') return;

        setTodoList(prevList => [
            ...prevList,
            {
                id: Date.now(),
                name: newTodo.trim(),
                isDone: false,
            }
        ]);
        setNewTodo('');
    }, [newTodo]);

    const markAsDone = useCallback((id: number) => {
        setTodoList(prevList =>
            prevList.map(todo =>
                todo.id === id ? {...todo, isDone: true} : todo
            )
        );
    }, []);

    const deleteTodo = useCallback((id: number) => {
        setTodoList(prevList => prevList.filter(todo => todo.id !== id));
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddTodo();
        }
    }, [handleAddTodo]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (todoList.length > 0) {
                e.preventDefault();
                setShowAlert(true);
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [todoList]);

    const handleSaveTodos = () => {
        setAuthModalOpen(true);
        setShowAlert(false);
    };

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
                    {todoList.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onMarkDone={markAsDone}
                            onDelete={deleteTodo}
                        />
                    ))}
                </div>
            </div>
            <div className={"flex flex-col gap-2"}>
                <span>Dockerized BoilerPlate Template for FullStack Web Application</span>
                <span>NextJs for Frontend Development</span>
                <span>FastAPI for Backend Development</span>
                <span>PostgreSQL for Relational Database</span>
                <span>Redis for Caching</span>
            </div>
            {showAlert && (
                <CustomAlert
                    message="You have unsaved todos. Would you like to save them?"
                    onConfirm={handleSaveTodos}
                    onCancel={() => setShowAlert(false)}
                />
            )}
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)}/>
        </main>
    );
};

interface TodoItemProps {
    todo: TodoItem;
    onMarkDone: (id: number) => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = React.memo(({todo, onMarkDone, onDelete}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex flex-row gap-2 justify-between items-center p-2 hover:bg-gray-100 rounded"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-row gap-2 items-center">
                <Image
                    width={20}
                    height={20}
                    src={todo.isDone ? imagePath.checkedCheckbox : imagePath.checkbox}
                    alt="checkbox"
                    onClick={() => !todo.isDone && onMarkDone(todo.id)}
                    className="cursor-pointer"
                />
                <span className={todo.isDone ? "line-through text-gray-500" : ""}>{todo.name}</span>
            </div>
            {isHovered && (
                <Image
                    width={20}
                    height={20}
                    src={imagePath.delete}
                    alt="delete"
                    onClick={() => onDelete(todo.id)}
                    className="cursor-pointer"
                />
            )}
        </div>
    );
});

TodoItem.displayName = 'TodoItem';

export default Home;
