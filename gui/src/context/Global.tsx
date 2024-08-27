'use client';
import React, {createContext, ReactNode, useState} from 'react';

interface GlobalContextProps {
    authModalOpen: boolean;
    setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultState: GlobalContextProps = {
    authModalOpen: false,
    setAuthModalOpen: () => {
    },
}

const GlobalContext = createContext<GlobalContextProps | undefined>(defaultState);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
                                                                      children,
                                                                  }) => {
    const [authModalOpen, setAuthModalOpen] = useState<boolean>(false)

    return (
        <GlobalContext.Provider
            value={{
                authModalOpen,
                setAuthModalOpen,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = React.useContext(GlobalContext);
    if (!context) {
        throw new Error('useBoardContext must be used within a BoardProvider');
    }
    return context;
}