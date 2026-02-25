import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, redirect } from '@tanstack/react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { LoginScreen } from './components/LoginScreen';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Breathe } from './pages/Breathe';
import { Sounds } from './pages/Sounds';
import { Journal } from './pages/Journal';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { TipsAndReminders } from './pages/TipsAndReminders';
import { SleepTracking } from './pages/SleepTracking';
import { VibrationControl } from './pages/VibrationControl';

// ─── Auth Guard Wrapper ───────────────────────────────────────────────────────

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse text-2xl">
            🧘
          </div>
          <p className="text-sm text-muted-foreground">Loading TRANQUIL...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && profile === null;

  return (
    <>
      {showProfileSetup && <ProfileSetupModal open={true} />}
      {!showProfileSetup && children}
    </>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <AuthGuard>
      <Layout />
    </AuthGuard>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const breatheRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/breathe',
  component: Breathe,
});

const soundsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sounds',
  component: Sounds,
});

const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journal',
  component: Journal,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: Analytics,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const tipsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tips',
  component: TipsAndReminders,
});

const sleepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sleep',
  component: SleepTracking,
});

const vibrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vibration',
  component: VibrationControl,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  breatheRoute,
  soundsRoute,
  journalRoute,
  analyticsRoute,
  profileRoute,
  settingsRoute,
  tipsRoute,
  sleepRoute,
  vibrationRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}
