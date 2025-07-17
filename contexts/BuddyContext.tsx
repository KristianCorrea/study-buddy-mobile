import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Buddy {
  id: number;
  user_id: number;
  name: string;
  species: string;
  level: number;
  experience: number;
  created_at: string;
}

const [buddy, setBuddy] = useState<Buddy>();

interface BuddyContextType 
{
  buddy: Buddy | undefined;
  addBuddy: (buddy: Omit<Buddy, 'id' | 'user_id' | 'level' | 'experience' |'created_at'>) => Promise<void>;
  fetchBuddy: (userId: number, buddyId: number) => Promise<void>;
  updateBuddy: (userId: number, buddyId: number, updates: Partial<Buddy>) => Promise<void>;
  deleteBuddy: (userId: number, buddyId: number) => Promise<void>;
}

const BuddyContext = createContext<BuddyContextType | undefined>(undefined);

export const BuddyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => 
{

  const addBuddy = async (buddy: Omit<Buddy, 'id' | 'user_id' | 'level' | 'experience' |'created_at'>) => 
  {
    try 
    {
      const response = await api.post('/api/tomadachi', buddy);
      setBuddy(response.data);
    } 

    catch (error) 
    {
      console.error('Failed to add buddy:', error);
    }
  };

  const fetchBuddy = async (userId: number, buddyId: number) => 
  {
    try 
    {
      const response = await api.get(`/api/tomadachi/${userId}/${buddyId}`);
      setBuddy(response.data);
      console.log(response.data);
    } 
    
    catch (error) 
    {
      console.error('Failed to fetch books:', error);
    } 
  };

  const updateBuddy = async (userId: number, buddyId: number, updates: Partial<Buddy>) => 
  {
    try 
    {
      const response = await api.patch(`/api/tomadachi/${userId}/${buddyId}`, updates);
      setBuddy(prev => prev ? { ...prev, ...response.data } : prev);
    } 

    catch (error) 
    {
      console.error('Failed to update book:', error);
    }
  };

  const deleteBuddy = async (userId: number, buddyId: number,) => 
  {
    try 
    {
      await api.delete(`/api/tomadachi/${userId}/${buddyId}`);
      setBuddy(undefined);
    } 
    
    catch (error) 
    {
      console.error('Failed to delete buddy:', error);
    }
  };

useEffect(() => {
  fetchBuddy(1, 1); // Idk what to put here???
}, []);

  return (
    <BuddyContext.Provider
      value={{ buddy, addBuddy, fetchBuddy, updateBuddy, deleteBuddy }}
    >
      {children}
    </BuddyContext.Provider>
  );
};

export const useBuddy = () => {
  const context = useContext(BuddyContext);
  
  if (context === undefined) 
  {
      throw new Error('useBuddy must be used within a BuddyProvider');
  }

  return context;
};