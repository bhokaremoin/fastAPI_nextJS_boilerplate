'use client';
import React, {createContext, ReactNode} from 'react';

interface GlobalContextProps {

}

const defaultState: GlobalContextProps = {}

const GlobalContext = createContext<GlobalContextProps | undefined>(defaultState);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
                                                                      children,
                                                                  }) => {
    return (
        <GlobalContext.Provider
            value={{}}
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