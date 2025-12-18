
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
}

export interface Instructor {
  id: string;
  name: string;
  initials: string;
  studentsCount: number;
  phone: string;
  specialties: string;
  avatarColor: string;
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
