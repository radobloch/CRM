export type UserRole = 'super_admin' | 'sales_rep';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  avatar: string;
  quotaMonthly: number;
  revenueGenerated: number;
  activeDealsCount: number;
}

export type ContactStatus = 'Lead' | 'Qualifiziert' | 'Kunde' | 'Inaktiv';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  role: string;
  companyId: string;
  companyName: string;
  status: ContactStatus;
  lifecycleStage?: string;
  leadStatus?: string;
  ownerId: string;
  ownerName: string;
  avatar: string;
  lastContacted: string;
  dealValuePotential: number;
  tags: string[];
  notes?: string;
  createdAt?: string;
}

export type CompanyTier = 'Enterprise' | 'Mid-Market' | 'SMB';

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  city: string;
  country: string;
  website: string;
  tier: CompanyTier;
  dealsCount: number;
  totalPipelineValue: number;
  primaryContact: string;
  logoText: string;
  accentColor: string;
}

export type DealStage = 
  | 'lead_in' 
  | 'discovery' 
  | 'proposal' 
  | 'negotiation' 
  | 'closed_won' 
  | 'closed_lost';

export interface DealStageConfig {
  id: DealStage;
  label: string;
  color: string;
  badgeBg: string;
  probability: number;
}

export type DealPriority = 'Hoch' | 'Mittel' | 'Niedrig';

export interface Deal {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  value: number;
  stage: DealStage;
  priority: DealPriority;
  probability: number;
  expectedCloseDate: string;
  ownerId: string;
  ownerName: string;
  lastActivity: string;
  notes: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  time: string;
  contactName: string;
  companyName: string;
  dealTitle?: string;
  authorName: string;
  completed: boolean;
  dueDate?: string;
}

export type NavigationTab = 'pipeline' | 'contacts' | 'companies' | 'activities' | 'settings';
