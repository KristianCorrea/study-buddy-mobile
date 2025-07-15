import React from 'react';
import { BookProvider } from './BookContext';
// import { UserProvider } from './UserContext';
// import { QuizProvider } from './QuizContext';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
      <BookProvider>
          {children}
      </BookProvider>
  );
};
