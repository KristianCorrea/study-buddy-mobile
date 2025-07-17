import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '@/lib/axios';

interface Question {
  id: number;
  book_id: number;
  question_text: string;
  correct_answer: string;
  wrong_answers: string[];
  created_at: string;
}

interface QuestionContextType {
  questions: Question[];
  loading: boolean;
  fetchQuestionsByBook: (bookId: number) => Promise<void>;
  deleteQuestion: (questionId: number) => Promise<void>;
  updateQuestion: (questionId: number, updates: Partial<Question>) => Promise<void>;
  addQuestion: (bookId: number, data: Omit<Question, 'id' | 'created_at' | 'book_id'>) => Promise<void>;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestionsByBook = async (bookId: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/questions/book/${bookId}`);
      setQuestions(response.data);
      console.log("response.data", response.data);
      console.log("questions", questions);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (bookId: number, data: Omit<Question, 'id' | 'created_at' | 'book_id'>) => {
    setLoading(true);
    try {
      const response = await api.post(`/api/questions/book/${bookId}`, data);
      setQuestions(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to add question:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId: number) => {
    setLoading(true);
    try {
      await api.delete(`/api/questions/${questionId}`);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (error) {
      console.error('Failed to delete question:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (questionId: number, updates: Partial<Question>) => {
    setLoading(true);
    try {
      const response = await api.put(`/api/questions/${questionId}`, updates);
      setQuestions(prev =>
        prev.map(q => (q.id === questionId ? { ...q, ...response.data } : q))
      );
    } catch (error) {
      console.error('Failed to update question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        questions,
        loading,
        fetchQuestionsByBook,
        addQuestion,
        deleteQuestion,
        updateQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestions must be used within a QuestionProvider');
  }
  return context;
};
