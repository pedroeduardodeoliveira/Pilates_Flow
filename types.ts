
import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  color?: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export interface ClassItem {
  id: string;
  time: string;
  student: string;
  instructor: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  day: number; // 0 (SEG) to 5 (SÁB)
  student: string;
  instructor: string;
  instructorInitials: string;
  color: 'orange' | 'blue' | 'pink' | 'green';
  equipment?: string;
}

export interface EscalaItem {
  id: string;
  time: string;
  day: number; // 0 (SEG) to 5 (SÁB)
  equipment: string;
  instructor: string;
  instructorInitials: string;
  color: 'orange' | 'blue' | 'pink' | 'green';
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  status: 'Ativo' | 'Inativo';
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  expiryDate: string;
  daysToExpiry: number;
  isExpired?: boolean;
  schedule: string[];
  instructor: string;
  phone: string;
  birthDate?: string;
  cpf?: string;
  regDate?: string;
  planType?: string;
  image?: string | null;
  observations?: string;
  address?: {
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    complement?: string;
  };
}

export interface Instructor {
  id: string;
  name: string;
  initials: string;
  studentsCount: number;
  phone: string;
  specialties: string;
  avatarColor: string;
  cpf?: string;
  password?: string;
  birthDate?: string;
  regDate?: string;
  image?: string | null;
  address?: {
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  schedule?: string[];
  workingDays?: string[];
  workStart?: string;
  workEnd?: string;
  classDuration?: number;
}

export interface UserSession {
  id: string;
  name: string;
  role: 'admin' | 'instructor';
  avatar?: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  roomName: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  type: 'Receita' | 'Despesa';
  category: string;
  status: 'Pago' | 'Pendente';
}