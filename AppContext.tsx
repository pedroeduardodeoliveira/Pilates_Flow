import React, { createContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import { Student, Instructor, Room, Equipment, Transaction, EscalaItem } from './types';
import { mockStudentsData, mockInstructorsData, mockRoomsData, mockEquipmentsData, mockTransactionsData, mockEscalaData } from './mockData';

// --- TIPOS ---
interface SettingsData {
  isDarkMode: boolean;
  appName: string;
  logo: string | null;
  phone: string;
  email: string;
  cnpj: string;
  address: {
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  plans: { label: string; value: string }[];
  commission: string;
  alertDays: string;
}

interface AppState {
  students: Student[];
  instructors: Instructor[];
  rooms: Room[];
  equipments: Equipment[];
  transactions: Transaction[];
  escala: EscalaItem[];
  settings: SettingsData;
  activeTab: string;
}

type Action = 
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'UPDATE_STUDENTS'; payload: Student[] }
  | { type: 'UPDATE_INSTRUCTORS'; payload: Instructor[] }
  | { type: 'UPDATE_ROOMS'; payload: Room[] }
  | { type: 'UPDATE_EQUIPMENTS'; payload: Equipment[] }
  | { type: 'UPDATE_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'UPDATE_ESCALA'; payload: EscalaItem[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<SettingsData> }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'TOGGLE_THEME' };


interface AppContextType {
  state: AppState;
  dispatch: Dispatch<Action>;
}

// --- ESTADO INICIAL ---
const initialSettings: SettingsData = {
  isDarkMode: false,
  appName: 'Pilates Flow',
  logo: null,
  phone: '',
  email: '',
  cnpj: '',
  address: {
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
  },
  plans: [
    { label: 'Valor para 1 aula por semana', value: '150' },
    { label: 'Valor para 2 aulas por semana', value: '250' },
    { label: 'Valor para 3 aulas por semana', value: '320' },
    { label: 'Valor para 4 aulas por semana', value: '380' },
    { label: 'Valor para 5 aulas por semana', value: '420' },
  ],
  commission: '40',
  alertDays: '7',
};

const initialState: AppState = {
  students: mockStudentsData,
  instructors: mockInstructorsData,
  rooms: mockRoomsData,
  equipments: mockEquipmentsData,
  transactions: mockTransactionsData,
  escala: mockEscalaData,
  settings: initialSettings,
  activeTab: 'escala',
};

// --- REDUCER ---
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
        return action.payload;
    case 'UPDATE_STUDENTS':
      return { ...state, students: action.payload };
    case 'UPDATE_INSTRUCTORS':
      return { ...state, instructors: action.payload };
    case 'UPDATE_ROOMS':
      return { ...state, rooms: action.payload };
    case 'UPDATE_EQUIPMENTS':
      return { ...state, equipments: action.payload };
    case 'UPDATE_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'UPDATE_ESCALA':
      return { ...state, escala: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, settings: { ...state.settings, isDarkMode: !state.settings.isDarkMode } };
    default:
      return state;
  }
};

// --- CONTEXTO ---
export const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null,
});

// --- PROVIDER ---
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar estado do localStorage na inicialização
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('pilatesFlowData');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'SET_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error("Failed to parse state from localStorage", error);
    }
  }, []);

  // Salvar estado no localStorage em cada mudança
  useEffect(() => {
    try {
      localStorage.setItem('pilatesFlowData', JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [state]);

  // Aplicar tema (light/dark)
  useEffect(() => {
    if (state.settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.settings.isDarkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};