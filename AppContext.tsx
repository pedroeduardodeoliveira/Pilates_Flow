import React, { createContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import { Student, Instructor, Room, Equipment, Transaction, EscalaItem, AgendaItem, UserSession, StudioSettings } from './types';
import { mockStudentsData, mockInstructorsData, mockRoomsData, mockEquipmentsData, mockTransactionsData, mockEscalaData, mockAgendaData } from './mockData';

// --- TIPOS ---
interface SettingsData extends StudioSettings {
  isDarkMode: boolean;
}

interface AppState {
  isAuthenticated: boolean;
  user: UserSession | null;
  impersonatingFrom: UserSession | null;
  students: Student[];
  instructors: Instructor[];
  rooms: Room[];
  equipments: Equipment[];
  transactions: Transaction[];
  escala: EscalaItem[];
  agenda: AgendaItem[];
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
  | { type: 'UPDATE_AGENDA'; payload: AgendaItem[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<SettingsData> }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'LOGIN'; payload: UserSession }
  | { type: 'LOGOUT' }
  | { type: 'IMPERSONATE'; payload: { user: UserSession, settings: StudioSettings } }
  | { type: 'STOP_IMPERSONATING' };


interface AppContextType {
  state: AppState;
  dispatch: Dispatch<Action>;
}

// --- LÓGICA DE CÁLCULO DINÂMICO ---
const calculateDynamicStudentData = (students: Student[], settings: SettingsData): Student[] => {
    const today = new Date(2025, 11, 18); // Data "atual" fixa para consistência do mock
    today.setHours(0, 0, 0, 0);

    return students.map(student => {
        if (!student.expiryDate) {
            return { ...student, daysToExpiry: 999, isExpired: false };
        }
        const [day, month, year] = student.expiryDate.split('/').map(Number);
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
             return { ...student, daysToExpiry: 999, isExpired: false };
        }
        const expiry = new Date(year, month - 1, day);
        expiry.setHours(0, 0, 0, 0);
        
        const diffTime = expiry.getTime() - today.getTime();
        const daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Lógica de inativação automática
        const autoInactiveDays = parseInt(settings.autoInactiveDays, 10);
        let newStatus = student.status;
        if (!isNaN(autoInactiveDays) && student.status === 'Ativo' && daysToExpiry < 0 && Math.abs(daysToExpiry) >= autoInactiveDays) {
            newStatus = 'Inativo';
        }
        
        return {
            ...student,
            daysToExpiry,
            isExpired: daysToExpiry < 0,
            status: newStatus,
        };
    });
};


// --- ESTADO INICIAL ---
const initialSettings: SettingsData = {
  isDarkMode: true,
  appName: 'Pilates Flow',
  logo: null,
  phone: '',
  email: '',
  documentType: 'CNPJ',
  document: '',
  address: {
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    complement: '',
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
  autoInactiveDays: '30',
  instructorSeesAllStudents: false, // Valor padrão
};

const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  impersonatingFrom: null,
  students: mockStudentsData,
  instructors: mockInstructorsData,
  rooms: mockRoomsData,
  equipments: mockEquipmentsData,
  transactions: mockTransactionsData,
  escala: mockEscalaData,
  agenda: mockAgendaData,
  settings: initialSettings,
  activeTab: 'painel',
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
    case 'UPDATE_AGENDA':
        return { ...state, agenda: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, settings: { ...state.settings, isDarkMode: !state.settings.isDarkMode } };
    case 'LOGIN':
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 25);
      
      return { 
        ...state, 
        isAuthenticated: true, 
        user: {
          ...action.payload,
          license: action.payload.role === 'admin' 
            ? { status: 'expiring_soon', expiresAt: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString() }
            : { status: 'active', expiresAt: expirationDate.toISOString() }
        }
      };
    case 'LOGOUT':
      return { ...initialState, settings: state.settings, isAuthenticated: false, user: null, impersonatingFrom: null };
    case 'IMPERSONATE':
        return {
            ...state,
            isAuthenticated: true,
            impersonatingFrom: state.user,
            user: action.payload.user,
            settings: { ...action.payload.settings, isDarkMode: state.settings.isDarkMode },
            activeTab: 'painel',
        };
    case 'STOP_IMPERSONATING':
        if (!state.impersonatingFrom) {
            return state;
        }
        return {
            ...state,
            user: state.impersonatingFrom,
            impersonatingFrom: null,
            settings: { ...initialSettings, isDarkMode: state.settings.isDarkMode },
            activeTab: 'painel',
        };
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
  const initializer = (initialValue: AppState): AppState => {
      let finalState: AppState;
      try {
          const savedState = localStorage.getItem('pilatesFlowData');
          if (savedState) {
              const parsedState = JSON.parse(savedState);
              finalState = { ...initialValue, ...parsedState, settings: { ...initialValue.settings, ...parsedState.settings }};
          } else {
              finalState = initialValue;
          }
      } catch (error) {
          console.error("Falha ao carregar estado do localStorage, usando estado inicial.", error);
          finalState = initialValue;
      }
      
      finalState.students = calculateDynamicStudentData(finalState.students, finalState.settings);
      
      return finalState;
  };

  const [state, dispatch] = useReducer(appReducer, initialState, initializer);
  
  useEffect(() => {
    try {
      const stateToSave = { ...state };
      localStorage.setItem('pilatesFlowData', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Falha ao salvar estado no localStorage", error);
    }
  }, [state]);

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