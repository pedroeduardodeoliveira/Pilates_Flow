import { Client, StudioSettings, SubscriptionPlan } from './types';

const createDefaultSettings = (appName: string): StudioSettings => ({
  appName,
  logo: null,
  phone: '(11) 91234-5678',
  email: 'contato@email.com',
  documentType: 'CNPJ',
  document: '00.000.000/0001-00',
  adminPassword: 'admin123',
  address: {
    cep: '01001-000', street: 'Praça da Sé', number: '1', neighborhood: 'Sé', city: 'São Paulo', state: 'SP', complement: ''
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
  instructorSeesAllStudents: false,
});

export const superAdminClients: Client[] = [
    {
        id: 'CLI-001',
        studioName: 'Pilates Flow - Moema',
        adminName: 'Ana Clara Souza',
        adminPassword: 'admin123',
        licenseStatus: 'Ativa',
        expiresAt: '15/01/2026',
        studentCount: 52,
        instructorCount: 4,
        mrr: 159.90,
        subscriptionPlanId: 'plan_intermediate',
        settings: createDefaultSettings('Pilates Flow - Moema')
    },
    {
        id: 'CLI-002',
        studioName: 'Studio Zen Pilates',
        adminName: 'Roberto Martins',
        adminPassword: 'admin123',
        licenseStatus: 'Teste',
        expiresAt: '28/12/2025',
        studentCount: 12,
        instructorCount: 2,
        mrr: 0,
        subscriptionPlanId: 'trial',
        settings: createDefaultSettings('Studio Zen Pilates')
    },
    {
        id: 'CLI-003',
        studioName: 'Corpo & Mente Pilates',
        adminName: 'Juliana Ferreira',
        adminPassword: 'admin123',
        licenseStatus: 'Ativa',
        expiresAt: '10/06/2026',
        studentCount: 89,
        instructorCount: 7,
        mrr: 199.90,
        subscriptionPlanId: 'plan_pro',
        settings: createDefaultSettings('Corpo & Mente Pilates')
    },
    {
        id: 'CLI-004',
        studioName: 'Vitality Studio',
        adminName: 'Carlos Andrade',
        adminPassword: 'admin123',
        licenseStatus: 'Expirada',
        expiresAt: '01/11/2025',
        studentCount: 34,
        instructorCount: 3,
        mrr: 159.90,
        subscriptionPlanId: 'plan_intermediate',
        settings: createDefaultSettings('Vitality Studio')
    },
    {
        id: 'CLI-005',
        studioName: 'Studio Harmonia',
        adminName: 'Fernanda Lima',
        adminPassword: 'admin123',
        licenseStatus: 'Pendente',
        expiresAt: '12/12/2025',
        studentCount: 41,
        instructorCount: 4,
        mrr: 119.90,
        subscriptionPlanId: 'plan_basic',
        settings: createDefaultSettings('Studio Harmonia')
    },
    {
        id: 'CLI-006',
        studioName: 'Pilates Premium',
        adminName: 'Gustavo Borges',
        adminPassword: 'admin123',
        licenseStatus: 'Ativa',
        expiresAt: '20/08/2026',
        studentCount: 120,
        instructorCount: 10,
        mrr: 299.90,
        subscriptionPlanId: 'plan_premium',
        settings: createDefaultSettings('Pilates Premium')
    },
];

export const superAdminSubscriptionPlans: SubscriptionPlan[] = [
    {
        id: 'plan_basic',
        name: 'Plano Básico',
        price: 119.90,
        studentLimit: 200,
        features: {
            financialModule: false,
            bulkAllocation: true,
            whatsappBot: false,
        }
    },
    {
        id: 'plan_intermediate',
        name: 'Plano Intermediário',
        price: 159.90,
        studentLimit: 300,
        features: {
            financialModule: true,
            bulkAllocation: true,
            whatsappBot: false,
        }
    },
    {
        id: 'plan_pro',
        name: 'Plano Pro',
        price: 199.90,
        studentLimit: 500,
        features: {
            financialModule: true,
            bulkAllocation: true,
            whatsappBot: true,
        }
    },
    {
        id: 'plan_premium',
        name: 'Plano Premium',
        price: 299.90,
        studentLimit: 'unlimited',
        features: {
            financialModule: true,
            bulkAllocation: true,
            whatsappBot: true,
        }
    }
];