import React, { useState, useEffect, useCallback } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import Button from './components/Button';
import NotificationToast from './components/NotificationToast';
import type { User, Referral } from './types';
import { login, getAdminData, setReferralReminder, subscribeToNewReferrals, unsubscribeFromNewReferrals, verifyAccount } from './services/mockApiService';

interface AppNotification {
  id: string;
  message: string;
  note?: string;
  isRead: boolean;
}

const VerificationStatus: React.FC<{ message: string; showLoginLink?: boolean }> = ({ message, showLoginLink }) => (
    <div className="min-h-screen flex flex-col">
        <Header currentUser={null} onLogout={() => {}} unreadCount={0} />
        <div className="flex-grow flex items-center justify-center bg-brand-light-gray">
            <Card className="text-center max-w-md mx-4">
                <h1 className="text-2xl font-bold font-serif text-brand-gray mb-4">{message}</h1>
                {showLoginLink && <a href="#/"><Button>Go to Login Page</Button></a>}
            </Card>
        </div>
        <Footer />
    </div>
);

const GOOGLE_CLIENT_ID = '846999197799-pjlguh7e86r56lhdnlddvie7m4ao9fpq.apps.googleusercontent.com';  // Replace with your actual client ID

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [route, setRoute] = useState(window.location.hash);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [pageView, setPageView] = useState<'app' | 'verifying' | 'verified' | 'verify_error'>('app');
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    const handleRouteChange = async () => {
        const hash = window.location.hash;
        setRoute(hash);

        if (hash.startsWith('#/verify')) {
            setPageView('verifying');
            const token = new URLSearchParams(hash.split('?')[1]).get('token');
            if (token) {
                try {
                    await verifyAccount(token);
                    setPageView('verified');
                } catch (error) {
                    console.error("Verification failed:", error);
                    setPageView('verify_error');
                }
            } else {
                setPageView('verify_error');
            }
        } else {
            setPageView('app');
        }
    };

    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();

    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      return;
    }

    const checkReminders = async () => {
      try {
        const { referrals } = await getAdminData();
        const now = new Date();
        
        for (const referral of referrals) {
          if (referral.reminderDate && new Date(referral.reminderDate) <= now) {
            setNotifications(prev => {
                if (prev.some(n => n.id === referral.id)) return prev;
                return [...prev, {
                    id: referral.id,
                    message: `Reminder: Follow up with ${referral.clientName}.`,
                    note: referral.reminderNote || undefined,
                    isRead: false
                }];
            });
            await setReferralReminder(referral.id, null, null);
          }
        }
      } catch (error) {
        console.error("Failed to check reminders:", error);
      }
    };
    const reminderIntervalId = setInterval(checkReminders, 15000);

    const handleNewReferral = (newReferral: Referral) => {
        setNotifications(prev => {
            if (prev.some(n => n.id === newReferral.id)) return prev;
            return [...prev, { id: newReferral.id, message: `New lead from ${newReferral.referrerName} for ${newReferral.clientName}.`, isRead: false }];
        });
    };
    subscribeToNewReferrals(handleNewReferral);

    return () => {
        clearInterval(reminderIntervalId);
        unsubscribeFromNewReferrals(handleNewReferral);
    };
  }, [currentUser]);

  const handleLogin = useCallback(async (role: 'user' | 'admin') => {
    setAuthMessage('');
    try {
        const user = await login(role);
        setCurrentUser(user);
        window.location.hash = role === 'admin' ? '#/admin' : '#/dashboard';
    } catch (error: any) {
        if (error.message === 'USER_NOT_VERIFIED') {
            setAuthMessage("Your account isn't active yet. We've resent the verification email to your inbox. Please check to continue.");
        } else {
            setAuthMessage("Login failed. Please try again.");
            console.error(error);
        }
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    window.location.hash = '#/';
  }, []);
  
  const removeNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const handleProfileUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderContent = () => {
    if (!currentUser) {
      return <LandingPage onLogin={handleLogin} authMessage={authMessage} />;
    }

    if (route === '#/admin' && currentUser.role === 'admin') {
      return <AdminPage />;
    }
    
    if (route === '#/profile') {
        return <ProfilePage user={currentUser} onProfileUpdate={handleProfileUpdate} />;
    }
    
    if (route === '#/dashboard' || (route !== '#/admin' && currentUser.role === 'user')) {
       return <DashboardPage user={currentUser} />;
    }
    
    if (currentUser.role === 'admin') {
       window.location.hash = '#/admin';
       return <AdminPage />;
    }

    return <LandingPage onLogin={handleLogin} authMessage={authMessage} />;
  };
  
  if (pageView !== 'app') {
      let message = '';
      let showLoginLink = false;
      if (pageView === 'verifying') message = 'Verifying your account...';
      if (pageView === 'verified') {
          message = 'Account verified successfully! You can now log in.';
          showLoginLink = true;
      }
      if (pageView === 'verify_error') {
          message = 'This verification link is invalid or has expired.';
          showLoginLink = true;
      }
      return <VerificationStatus message={message} showLoginLink={showLoginLink} />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex flex-col bg-slate-50 text-brand-gray">
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          unreadCount={unreadCount}
        />
        <main className="flex-grow">
          {renderContent()}
        </main>
        <Footer />
        <div className="fixed top-20 right-4 w-80 space-y-2 z-50">
          {unreadCount > 0 && (
              <div className="flex justify-end mb-1">
                  <button 
                      onClick={handleMarkAllAsRead} 
                      className="bg-white text-brand-teal border border-brand-teal text-xs font-semibold py-1 px-3 rounded-full hover:bg-brand-teal hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
                  >
                      Mark all as read
                  </button>
              </div>
          )}
          {notifications.map(notification => (
              <NotificationToast
                  key={notification.id}
                  message={notification.message}
                  note={notification.note}
                  isRead={notification.isRead}
                  onClose={() => removeNotification(notification.id)}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
              />
          ))}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
