import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { LaunchSplashScreen } from './components/LaunchSplashScreen.js';
import { Navbar } from './components/Navbar.js';
import { BottomNav } from './components/BottomNav.js';
import { HomeView } from './components/HomeView.js';
import { StudyRoomsView } from './components/StudyRoomsView.js';
import { DoubtZoneView } from './components/DoubtZoneView.js';
import { MockTestsView } from './components/MockTestsView.js';
import { AdminPanelView } from './components/AdminPanelView.js';
import { AuthModal } from './components/AuthModal.js';
import { SubscriptionModal } from './components/SubscriptionModal.js';
import { ProfileModal } from './components/ProfileModal.js';

function MainApp() {
  const { isLoggedIn, isAdmin } = useAuth();

  // App launch splash screen (shows on first app load)
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem('rw_splash_shown');
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const [autoOpenCreatePost, setAutoOpenCreatePost] = useState<boolean>(false);

  const handleSplashComplete = () => {
    sessionStorage.setItem('rw_splash_shown', 'true');
    setShowSplash(false);
  };

  const handleNavigate = (view: string) => {
    if (view === 'home-post') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentView('home');
      setAutoOpenCreatePost(true);
      return;
    }
    // If navigated to removed reels, redirect to tests
    const target = view === 'reels' ? 'tests' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(target);
  };

  return (
    <div className="min-h-screen bg-[#101426] text-white flex flex-col selection:bg-[#7857FF] selection:text-white antialiased">
      {/* 1. Launch Splash Screen on first entrance */}
      {showSplash && <LaunchSplashScreen onComplete={handleSplashComplete} />}

      {/* 2. Top Sticky Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* 3. Main Content Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
            autoOpenCreatePost={autoOpenCreatePost}
            onResetAutoOpenCreatePost={() => setAutoOpenCreatePost(false)}
          />
        )}

        {currentView === 'rooms' && (
          <StudyRoomsView onOpenAuth={() => setIsAuthModalOpen(true)} />
        )}

        {currentView === 'doubts' && (
          <DoubtZoneView
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'tests' && (
          <MockTestsView
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {currentView === 'admin' && (
          isAdmin ? (
            <AdminPanelView onOpenAuth={() => setIsAuthModalOpen(true)} />
          ) : (
            <HomeView
              onNavigate={handleNavigate}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
            />
          )
        )}
      </main>

      {/* 4. Mobile Bottom Nav Bar */}
      <BottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* 5. Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onOpenAuth={() => {
          setIsSubscriptionModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
