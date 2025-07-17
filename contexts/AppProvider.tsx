import React from 'react';
import { BookProvider } from './BookContext';
// import { UserProvider } from './UserContext';
import { QuestionProvider } from './QuizContext';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
      <BookProvider>
          <QuestionProvider>
              {children}
          </QuestionProvider>
      </BookProvider>
  );
};
