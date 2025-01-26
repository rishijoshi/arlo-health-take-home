import { useState, ReactNode, createContext } from 'react';
import { IUserContextProps, IUser } from '../types/formData.types';


export const UserContext = createContext<IUserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

