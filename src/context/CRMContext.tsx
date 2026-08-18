import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Deal, 
  Contact, 
  Company, 
  Activity, 
  DealStage, 
  UserRole, 
  UserProfile, 
  NavigationTab 
} from '../types/crm';
import { 
  USER_PROFILES, 
  INITIAL_COMPANIES, 
  INITIAL_CONTACTS, 
  INITIAL_DEALS, 
  INITIAL_ACTIVITIES 
} from '../data/mockData';

// LocalStorage Keys for Matchpoint CRM
const STORAGE_KEYS = {
  DEALS: 'matchpoint_crm_deals_v1',
  CONTACTS: 'matchpoint_crm_contacts_v1',
  COMPANIES: 'matchpoint_crm_companies_v1',
  ACTIVITIES: 'matchpoint_crm_activities_v1',
  ROLE: 'matchpoint_crm_role_v1',
};

interface CRMContextType {
  // State
  deals: Deal[];
  contacts: Contact[];
  companies: Company[];
  activities: Activity[];
  activeRole: UserRole;
  activeProfile: UserProfile;
  currentTab: NavigationTab;
  activeContactRecordId: string | null;

  // Navigation & View Actions
  setCurrentTab: (tab: NavigationTab) => void;
  setActiveContactRecordId: (id: string | null) => void;
  switchRole: (role: UserRole) => void;

  // Deal Actions
  addDeal: (dealData: Omit<Deal, 'id'>) => void;
  updateDeal: (updatedDeal: Deal) => void;
  updateDealStage: (dealId: string, newStage: DealStage) => void;
  deleteDeal: (dealId: string) => void;

  // Contact Actions
  addContact: (contactData: Omit<Contact, 'id'>) => void;
  updateContact: (updatedContact: Contact) => void;
  deleteContact: (contactId: string) => void;

  // Activity Actions
  addActivity: (activityData: Omit<Activity, 'id'>) => void;
  toggleActivityComplete: (activityId: string) => void;

  // Demo helper
  resetToMockData: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize Deals from localStorage or mock data
  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEALS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load deals from localStorage', e);
    }
    return INITIAL_DEALS;
  });

  // 2. Initialize Contacts from localStorage or mock data
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load contacts from localStorage', e);
    }
    return INITIAL_CONTACTS;
  });

  // 3. Initialize Companies from localStorage or mock data
  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load companies from localStorage', e);
    }
    return INITIAL_COMPANIES;
  });

  // 4. Initialize Activities from localStorage or mock data
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load activities from localStorage', e);
    }
    return INITIAL_ACTIVITIES;
  });

  // 5. Active User Role
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole;
      if (saved === 'super_admin' || saved === 'sales_rep') return saved;
    } catch (e) {
      // fallback
    }
    return 'super_admin';
  });

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('pipeline');
  const [activeContactRecordId, setActiveContactRecordId] = useState<string | null>(null);

  const activeProfile = USER_PROFILES[activeRole];

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
    } catch (e) {
      console.error('Error saving deals', e);
    }
  }, [deals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (e) {
      console.error('Error saving contacts', e);
    }
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
    } catch (e) {
      console.error('Error saving companies', e);
    }
  }, [companies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Error saving activities', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, activeRole);
    } catch (e) {
      console.error('Error saving role', e);
    }
  }, [activeRole]);

  // Deal Handlers
  const addDeal = (dealData: Omit<Deal, 'id'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: `deal_${Date.now()}`,
    };

    setDeals((prev) => [newDeal, ...prev]);

    // Automatically update company pipeline totals
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === newDeal.companyId) {
          return {
            ...c,
            dealsCount: c.dealsCount + 1,
            totalPipelineValue: c.totalPipelineValue + newDeal.value,
          };
        }
        return c;
      })
    );

    // Auto-create initial activity log
    addActivity({
      type: 'note',
      title: `Deal erstellt: ${newDeal.title}`,
      description: `Projektvolumen: ${newDeal.value.toLocaleString('de-DE')} € • Phase: ${newDeal.stage}`,
      date: 'Heute',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName: newDeal.contactName,
      companyName: newDeal.companyName,
      dealTitle: newDeal.title,
      authorName: activeProfile.name,
      completed: true,
    });
  };

  const updateDeal = (updatedDeal: Deal) => {
    setDeals((prev) => prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
  };

  const updateDealStage = (dealId: string, newStage: DealStage) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          return {
            ...d,
            stage: newStage,
            lastActivity: `Phase geändert auf ${newStage}`,
          };
        }
        return d;
      })
    );
  };

  const deleteDeal = (dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
  };

  // Contact Handlers
  const addContact = (contactData: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contactData,
      id: `cont_${Date.now()}`,
    };

    setContacts((prev) => [newContact, ...prev]);

    // Create activity record for new contact
    addActivity({
      type: 'note',
      title: `Neuer Kontakt angelegt: ${newContact.firstName} ${newContact.lastName}`,
      description: `Position: ${newContact.role} bei ${newContact.companyName}. Betreuer: ${newContact.ownerName}.`,
      date: 'Heute',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName: `${newContact.firstName} ${newContact.lastName}`,
      companyName: newContact.companyName,
      authorName: activeProfile.name,
      completed: true,
    });
  };

  const updateContact = (updatedContact: Contact) => {
    setContacts((prev) => prev.map((c) => (c.id === updatedContact.id ? updatedContact : c)));
  };

  const deleteContact = (contactId: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  // Activity Handlers
  const addActivity = (activityData: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const toggleActivityComplete = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === activityId ? { ...act, completed: !act.completed } : act))
    );
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
  };

  const resetToMockData = () => {
    setDeals(INITIAL_DEALS);
    setContacts(INITIAL_CONTACTS);
    setCompanies(INITIAL_COMPANIES);
    setActivities(INITIAL_ACTIVITIES);
    setActiveRole('super_admin');
    localStorage.removeItem(STORAGE_KEYS.DEALS);
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.COMPANIES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  };

  return (
    <CRMContext.Provider
      value={{
        deals,
        contacts,
        companies,
        activities,
        activeRole,
        activeProfile,
        currentTab,
        activeContactRecordId,
        setCurrentTab,
        setActiveContactRecordId,
        switchRole,
        addDeal,
        updateDeal,
        updateDealStage,
        deleteDeal,
        addContact,
        updateContact,
        deleteContact,
        addActivity,
        toggleActivityComplete,
        resetToMockData,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = (): CRMContextType => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
