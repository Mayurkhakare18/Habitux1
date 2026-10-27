import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF4B26]/30 border-t-[#FF4B26] rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 mt-4">Verifying session credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0F172A] font-heading mb-2">
          Access Restricted
        </h2>
        <p className="text-sm text-slate-600 max-w-md mb-6">
          Your current account is registered as a <strong className="uppercase text-[#FF4B26]">{user.role}</strong>. You do not have permission to view this section ({allowedRoles.join(', ')} only).
        </p>
        <div className="flex gap-3">
          <Navigate to={user.role === 'owner' ? '/owner/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
