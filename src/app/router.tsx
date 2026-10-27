import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ui/ProtectedRoute';

// Layouts
import { StudentLayout } from '../components/layout/StudentLayout';
import { OwnerLayout } from '../components/layout/OwnerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { HostelsPage } from '../pages/HostelsPage';
import { HostelDetailPage } from '../pages/HostelDetailPage';
import { ComparePage } from '../pages/ComparePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { OwnerRegisterPage } from '../pages/OwnerRegisterPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';

// Student Pages
import { StudentOverviewPage } from '../pages/student/StudentOverviewPage';
import { StudentExplorePage } from '../pages/student/StudentExplorePage';
import { StudentSavedPage } from '../pages/student/StudentSavedPage';
import { StudentEnquiriesPage } from '../pages/student/StudentEnquiriesPage';
import { StudentMessagesPage } from '../pages/student/StudentMessagesPage';
import { StudentBookingsPage } from '../pages/student/StudentBookingsPage';
import { StudentBookingDetailPage } from '../pages/student/StudentBookingDetailPage';
import { StudentBookingConfirmPage } from '../pages/student/StudentBookingConfirmPage';
import { StudentBookingPaymentPage } from '../pages/student/StudentBookingPaymentPage';
import { StudentBookingPaymentSuccessPage } from '../pages/student/StudentBookingPaymentSuccessPage';
import { StudentBookingPaymentFailedPage } from '../pages/student/StudentBookingPaymentFailedPage';
import { StudentPaymentsPage } from '../pages/student/StudentPaymentsPage';
import { StudentPaymentDetailPage } from '../pages/student/StudentPaymentDetailPage';
import { StudentNotificationsPage } from '../pages/student/StudentNotificationsPage';
import { StudentProfilePage } from '../pages/student/StudentProfilePage';

// Owner Pages
import { OwnerOverviewPage } from '../pages/owner/OwnerOverviewPage';
import { OwnerListingsPage } from '../pages/owner/OwnerListingsPage';
import { OwnerNewListingPage } from '../pages/owner/OwnerNewListingPage';
import { OwnerEditListingPage } from '../pages/owner/OwnerEditListingPage';
import { OwnerEnquiriesPage } from '../pages/owner/OwnerEnquiriesPage';
import { OwnerMessagesPage } from '../pages/owner/OwnerMessagesPage';
import { OwnerBookingsPage } from '../pages/owner/OwnerBookingsPage';
import { OwnerBookingDetailPage } from '../pages/owner/OwnerBookingDetailPage';
import { OwnerRoomsPage } from '../pages/owner/OwnerRoomsPage';
import { OwnerProfilePage } from '../pages/owner/OwnerProfilePage';

// Admin Pages
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage';
import { AdminListingsPage } from '../pages/admin/AdminListingsPage';
import { AdminReviewsPage } from '../pages/admin/AdminReviewsPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/hostels" element={<HostelsPage />} />
      <Route path="/hostels/:slug" element={<HostelDetailPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/owner/register" element={<OwnerRegisterPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentOverviewPage />} />
        <Route path="explore" element={<StudentExplorePage />} />
        <Route path="saved" element={<StudentSavedPage />} />
        <Route path="enquiries" element={<StudentEnquiriesPage />} />
        <Route path="messages" element={<StudentMessagesPage />} />
        <Route path="messages/:conversationId" element={<StudentMessagesPage />} />
        <Route path="bookings" element={<StudentBookingsPage />} />
        <Route path="bookings/confirm/:bookingId" element={<StudentBookingConfirmPage />} />
        <Route path="bookings/:bookingId/payment" element={<StudentBookingPaymentPage />} />
        <Route path="bookings/:bookingId/payment/success" element={<StudentBookingPaymentSuccessPage />} />
        <Route path="bookings/:bookingId/payment/failed" element={<StudentBookingPaymentFailedPage />} />
        <Route path="bookings/:bookingId" element={<StudentBookingDetailPage />} />
        <Route path="payments" element={<StudentPaymentsPage />} />
        <Route path="payments/:paymentId" element={<StudentPaymentDetailPage />} />
        <Route path="notifications" element={<StudentNotificationsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      {/* Hostel Owner Protected Routes */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={['owner', 'admin']}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<OwnerOverviewPage />} />
        <Route path="listings" element={<OwnerListingsPage />} />
        <Route path="listings/new" element={<OwnerNewListingPage />} />
        <Route path="listings/:id/edit" element={<OwnerEditListingPage />} />
        <Route path="enquiries" element={<OwnerEnquiriesPage />} />
        <Route path="messages" element={<OwnerMessagesPage />} />
        <Route path="messages/:conversationId" element={<OwnerMessagesPage />} />
        <Route path="bookings" element={<OwnerBookingsPage />} />
        <Route path="bookings/:bookingId" element={<OwnerBookingDetailPage />} />
        <Route path="rooms" element={<OwnerRoomsPage />} />
        <Route path="profile" element={<OwnerProfilePage />} />
      </Route>

      {/* Platform Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverviewPage />} />
        <Route path="listings" element={<AdminListingsPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
