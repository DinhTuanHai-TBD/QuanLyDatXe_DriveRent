/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TrialBanner } from './components/common/TrialBanner';
import { ToastContainer } from './components/common/ToastContainer';

// Customer Portal Components & Views
import { CustomerHeader } from './components/customer/CustomerHeader';
import { CustomerFooter } from './components/customer/CustomerFooter';
import { AdminLoginModal } from './components/customer/AdminLoginModal';
import { BookingCheckoutModal } from './components/customer/BookingCheckoutModal';

import { HomeCustomerView } from './views/customer/HomeCustomerView';
import { AboutCustomerView } from './views/customer/AboutCustomerView';
import { VehiclesCustomerView } from './views/customer/VehiclesCustomerView';
import { VehicleDetailCustomerView } from './views/customer/VehicleDetailCustomerView';
import { GuideCustomerView } from './views/customer/GuideCustomerView';
import { LookupBookingCustomerView } from './views/customer/LookupBookingCustomerView';
import { ContactCustomerView } from './views/customer/ContactCustomerView';

// Internal Admin Portal Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { FleetView } from './views/FleetView';
import { ScheduleView } from './views/ScheduleView';
import { ContractsView } from './views/ContractsView';
import { CustomersView } from './views/CustomersView';
import { MaintenanceView } from './views/MaintenanceView';
import { FinanceReportView } from './views/FinanceReportView';
import { SettingsView } from './views/SettingsView';

// Internal Admin Modals
import { CreateContractWizard } from './views/CreateContractWizard';
import { AddVehicleModal } from './views/AddVehicleModal';
import { HandoverReturnModal } from './views/HandoverReturnModal';
import { SettlementModal } from './views/SettlementModal';
import { PrintContractModal } from './views/PrintContractModal';

const MainLayout: React.FC = () => {
  const { appMode, customerTab, isLoggedIn, activeTab } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 1. Customer Website Portal
  if (appMode === 'customer') {
    return (
      <div className="relative min-h-screen bg-slate-50/80 text-slate-900 flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white">
        {/* Subtle Ambient Liquid Glass Background Glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-emerald-200/25 blur-3xl" />
          <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-teal-200/20 blur-3xl" />
          <div className="absolute top-2/3 -left-20 w-[500px] h-[500px] rounded-full bg-emerald-100/30 blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-sky-200/20 blur-3xl" />
        </div>

        <CustomerHeader />

        <main className="flex-1 relative z-10">
          {customerTab === 'home' && <HomeCustomerView />}
          {customerTab === 'about' && <AboutCustomerView />}
          {customerTab === 'vehicles' && <VehiclesCustomerView />}
          {customerTab === 'vehicle_detail' && <VehicleDetailCustomerView />}
          {customerTab === 'guide' && <GuideCustomerView />}
          {customerTab === 'lookup' && <LookupBookingCustomerView />}
          {customerTab === 'contact' && <ContactCustomerView />}
        </main>

        <CustomerFooter />

        {/* Customer Modals */}
        <AdminLoginModal />
        <BookingCheckoutModal />

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    );
  }

  // 2. Internal Staff / Admin Portal Login Gate
  if (!isLoggedIn) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  // 3. Internal Staff / Admin Portal Main Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top trial notification banner */}
      <TrialBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Viewport */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
          <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'fleet' && <FleetView />}
            {activeTab === 'schedule' && <ScheduleView />}
            {activeTab === 'contracts' && <ContractsView />}
            {activeTab === 'customers' && <CustomersView />}
            {activeTab === 'maintenance' && <MaintenanceView />}
            {activeTab === 'finance' && <FinanceReportView />}
            {activeTab === 'settings' && <SettingsView />}
          </main>
        </div>
      </div>

      {/* Internal Management Modals */}
      <CreateContractWizard />
      <AddVehicleModal />
      <HandoverReturnModal />
      <SettlementModal />
      <PrintContractModal />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
