import React from 'react';
import { BookProvider } from './BookContext';
import { QuestionProvider } from './QuizContext';
import { UserProvider } from './UserContext';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
      <BookProvider>
          <UserProvider>
            <QuestionProvider>
                {children}
            </QuestionProvider>
          </UserProvider>
      </BookProvider>
  );
};
