import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface UserData {
    name: string;
    phone: string;
    email?: string;
}

interface AppContextType {
    selectedTreatmentId: string | null;
    setSelectedTreatmentId: (id: string | null) => void;
    userData: UserData | null;
    setUserData: (data: UserData | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    return (
        <AppContext.Provider
            value={{
                selectedTreatmentId,
                setSelectedTreatmentId,
                userData,
                setUserData,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
