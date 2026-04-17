import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/catalog/CatalogPage';
import ApiDetailPage from './pages/catalog/ApiDetailPage';
import SandboxPage from './pages/sandbox/SandboxPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminPage from './pages/admin/AdminPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import ExplorePage from './pages/explore/ExplorePage';
import ExploreApiDetailPage from './pages/explore/ExploreApiDetailPage';
import IntegrationWizardPage from './pages/explore/IntegrationWizardPage';
import AnnouncementsPage from './pages/announcements/AnnouncementsPage';
import CheckoutPage from './pages/checkout/CheckoutPage';

export default function App() {
  return (
    <Routes>
      {/* Auth - standalone pages */}
      <Route path="login" element={<LoginPage />} />
      <Route path="onboarding" element={<OnboardingPage />} />

      {/* Checkout - payment gateway */}
      <Route path="checkout" element={<CheckoutPage />} />

      {/* Admin - standalone page */}
      <Route path="admin" element={<AdminPage />} />

      {/* Public - entry point */}
      <Route element={<PublicLayout />}>
        <Route index element={<ExplorePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="explore/:id" element={<ExploreApiDetailPage />} />
        <Route path="explore/:id/integrate" element={<IntegrationWizardPage />} />
      </Route>

      {/* Authenticated portal */}
      <Route element={<Layout />}>
        <Route path="home" element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:id" element={<ApiDetailPage />} />
        <Route path="sandbox" element={<SandboxPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
      </Route>
    </Routes>
  );
}
