import React, { useState } from 'react';
import { User, HistoryItem } from './types';
import { logoutUser } from './api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DetailModal } from './components/DetailModal';
import { PocketBasketDrawer } from './components/PocketBasketDrawer';
import { PocketProvider } from './context/PocketContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePlannerPage } from './pages/HomePlannerPage';
import { PartyPlannerPage } from './pages/PartyPlannerPage';
import { JewelryPlannerPage } from './pages/JewelryPlannerPage';
import { HistoryPage } from './pages/HistoryPage';

function PocketSmartApp() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<HistoryItem | null>(null);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {}
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] font-sans text-[#F8FAFC] selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Get Started / Sign In Page - Always shown when entering the app */}
        {(currentPage === 'login' || currentPage === 'register') && (
          <LoginPage
            initialTab={currentPage === 'register' ? 'register' : 'signin'}
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* Overview Landing Page */}
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
          />
        )}

        {/* User Dashboard */}
        {currentPage === 'dashboard' && (
          <DashboardPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onViewDetail={(item) => setSelectedDetailItem(item)}
          />
        )}

        {/* Home Interior Budget Planner */}
        {currentPage === 'home-planner' && (
          <HomePlannerPage
            onNavigate={handleNavigate}
          />
        )}

        {/* Party Budget Planner */}
        {currentPage === 'party-planner' && (
          <PartyPlannerPage
            onNavigate={handleNavigate}
          />
        )}

        {/* Jewelry Budget Planner */}
        {currentPage === 'jewelry-planner' && (
          <JewelryPlannerPage
            onNavigate={handleNavigate}
          />
        )}

        {/* Recommendation History */}
        {currentPage === 'history' && (
          <HistoryPage
            onNavigate={handleNavigate}
            onViewDetail={(item) => setSelectedDetailItem(item)}
          />
        )}
      </main>

      {/* Modal for viewing detailed recommendations */}
      <DetailModal
        item={selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
      />

      {/* Slide-over Pocket Basket Drawer */}
      <PocketBasketDrawer />

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <PocketProvider>
      <PocketSmartApp />
    </PocketProvider>
  );
}
