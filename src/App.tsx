import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PipelineView } from './components/PipelineView';
import { ContactsView } from './components/ContactsView';
import { ContactRecordPage } from './components/ContactRecordPage';
import { CompaniesView } from './components/CompaniesView';
import { ActivitiesView } from './components/ActivitiesView';
import { SettingsView } from './components/SettingsView';
import { DealDetailModal } from './components/DealDetailModal';
import { ContactDetailModal } from './components/ContactDetailModal';
import { CompanyDetailModal } from './components/CompanyDetailModal';
import { NewDealModal } from './components/NewDealModal';
import { NewContactModal } from './components/NewContactModal';
import { Deal, Contact, Company, DealStage } from './types/crm';
import { CRMProvider, useCRM } from './context/CRMContext';

function CRMApp() {
  const {
    deals,
    contacts,
    companies,
    activities,
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
    addActivity,
    toggleActivityComplete,
  } = useCRM();

  // Selected Detail Modal State
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedContactModal, setSelectedContactModal] = useState<Contact | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // New Creation Modals
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [newDealDefaultStage, setNewDealDefaultStage] = useState<DealStage | undefined>(undefined);
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);

  const handleOpenNewDeal = (stage?: DealStage) => {
    setNewDealDefaultStage(stage);
    setIsNewDealOpen(true);
  };

  const handleTabChange = (tab: any) => {
    setCurrentTab(tab);
    setActiveContactRecordId(null);
  };

  const handleOpenContactRecord = (contact: Contact) => {
    setActiveContactRecordId(contact.id);
    setCurrentTab('contacts');
  };

  const activeContact = contacts.find((c) => c.id === activeContactRecordId);

  return (
    <div id="matchpoint-crm-root" className="flex h-screen w-screen frosted-bg text-slate-100 font-sans overflow-hidden antialiased select-none">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        activeProfile={activeProfile}
        totalDealsCount={deals.length}
        totalContactsCount={contacts.length}
        totalCompaniesCount={companies.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Global Header with Frosted Glass */}
        <Header
          activeProfile={activeProfile}
          onSwitchProfile={switchRole}
          onOpenNewDeal={() => handleOpenNewDeal()}
          onOpenNewContact={() => setIsNewContactOpen(true)}
          deals={deals}
          contacts={contacts}
          companies={companies}
          onSelectDeal={setSelectedDeal}
          onSelectContact={handleOpenContactRecord}
          onSelectCompany={setSelectedCompany}
        />

        {/* Tab Views */}
        <main className="flex-1 overflow-hidden relative">
          {currentTab === 'pipeline' && (
            <PipelineView
              deals={deals}
              activeProfile={activeProfile}
              onUpdateDealStage={updateDealStage}
              onSelectDeal={setSelectedDeal}
              onOpenNewDeal={handleOpenNewDeal}
            />
          )}

          {currentTab === 'contacts' && (
            activeContact ? (
              <ContactRecordPage
                contact={activeContact}
                companies={companies}
                deals={deals}
                activities={activities}
                activeProfile={activeProfile}
                onBack={() => setActiveContactRecordId(null)}
                onUpdateContact={updateContact}
                onSelectDeal={setSelectedDeal}
                onSelectCompany={setSelectedCompany}
                onAddActivity={addActivity}
                onToggleActivityComplete={toggleActivityComplete}
                onOpenNewDeal={() => handleOpenNewDeal()}
              />
            ) : (
              <ContactsView
                contacts={contacts}
                companies={companies}
                deals={deals}
                activeProfile={activeProfile}
                onSelectContact={handleOpenContactRecord}
                onOpenNewContact={() => setIsNewContactOpen(true)}
                onCreateContact={addContact}
              />
            )
          )}

          {currentTab === 'companies' && (
            <CompaniesView
              companies={companies}
              deals={deals}
              contacts={contacts}
              onSelectCompany={setSelectedCompany}
              onSelectDeal={setSelectedDeal}
            />
          )}

          {currentTab === 'activities' && (
            <ActivitiesView
              activities={activities}
              activeProfile={activeProfile}
              onToggleActivityComplete={toggleActivityComplete}
              onAddActivity={addActivity}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView activeProfile={activeProfile} />
          )}

          {/* Frosted Glass Environment Badge in bottom corner */}
          <div className="absolute bottom-3 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none z-10 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-300">Matchpoint CRM • Active Store & LocalStorage Sync</span>
          </div>
        </main>
      </div>

      {/* Modals / Drawers */}
      {selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onUpdateDeal={updateDeal}
          onDeleteDeal={deleteDeal}
        />
      )}

      {selectedContactModal && (
        <ContactDetailModal
          contact={selectedContactModal}
          companies={companies}
          deals={deals}
          onClose={() => setSelectedContactModal(null)}
          onUpdateContact={updateContact}
          onSelectDeal={setSelectedDeal}
        />
      )}

      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          deals={deals}
          contacts={contacts}
          onClose={() => setSelectedCompany(null)}
          onSelectDeal={setSelectedDeal}
          onSelectContact={handleOpenContactRecord}
        />
      )}

      {isNewDealOpen && (
        <NewDealModal
          companies={companies}
          contacts={contacts}
          activeProfile={activeProfile}
          defaultStage={newDealDefaultStage}
          onClose={() => {
            setIsNewDealOpen(false);
            setNewDealDefaultStage(undefined);
          }}
          onCreateDeal={addDeal}
        />
      )}

      {isNewContactOpen && (
        <NewContactModal
          companies={companies}
          activeProfile={activeProfile}
          onClose={() => setIsNewContactOpen(false)}
          onCreateContact={addContact}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <CRMApp />
    </CRMProvider>
  );
}
