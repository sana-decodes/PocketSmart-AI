import React, { useState, useEffect } from 'react';
import { User, HistoryItem } from './types';
import { getSessionInfo, logoutUser } from './api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DetailModal } from './components/DetailModal';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePlannerPage } from './pages/HomePlannerPage';
import { PartyPlannerPage } from './pages/PartyPlannerPage';
import { JewelryPlannerPage } from './pages/JewelryPlannerPage';
import { HistoryPage } from './pages/HistoryPage';

export default function App() {
  // Always default to 'login' (Get Started / Sign In page) whenever the user enters the app
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<HistoryItem | null>(null);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {}
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    // If not logged in and trying to access protected user areas, direct to Sign In / Get Started
    if (!currentUser && (page === 'dashboard' || page === 'history')) {
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-amber-300 selection:text-slate-900">
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

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
      />
    </div>
  );
}
