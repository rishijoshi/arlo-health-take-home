import { useContext } from 'react';
import { IUserContextProps } from '../types/formData.types';
import { UserContext } from '../context/UserContext';

export const useUser = (): IUserContextProps => {
    const context = useContext(UserContext) as IUserContextProps;
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};