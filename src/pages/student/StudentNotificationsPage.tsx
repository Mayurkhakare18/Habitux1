import React, { useState, useEffect } from 'react';
import { useAuth } from '../../app/AuthContext';
import { HabituxAPI } from '../../lib/supabase';
import { NotificationItem } from '../../types';
import { Bell, Check, Clock } from 'lucide-react';

export const StudentNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!user) return;
    HabituxAPI.getNotifications(user.id).then(setNotifications);
  }, [user]);

  const handleMarkRead = async (id: string) => {
    await HabituxAPI.markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] font-heading">
          Notifications & Alerts
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Stay updated on visit confirmations, owner responses, and student housing tips
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EDE8DF] shadow-xs divide-y divide-slate-100 overflow-hidden">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-5 flex items-start justify-between gap-4 transition-colors ${
              notif.read_at ? 'bg-white text-slate-500' : 'bg-[#FFF1ED]/30 text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                notif.read_at ? 'bg-slate-100 text-slate-400' : 'bg-[#FFF1ED] text-[#FF4B26]'
              }`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 font-heading">{notif.title}</h4>
                  {!notif.read_at && (
                    <span className="w-2 h-2 rounded-full bg-[#FF4B26] inline-block"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                <span className="text-[10px] text-slate-400 block pt-0.5">
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {!notif.read_at && (
              <button
                onClick={() => handleMarkRead(notif.id)}
                className="px-3 py-1 bg-white border border-[#EDE8DF] hover:border-[#FF4B26] text-xs font-semibold text-slate-700 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
