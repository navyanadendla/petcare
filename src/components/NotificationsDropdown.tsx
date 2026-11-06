import React from 'react';
import { Bell, Check, Clock, Calendar, Syringe, Pill, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onSelectTab: (tab: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  unreadCount,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'vaccine':
        return <Syringe className="w-4 h-4 text-emerald-600" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case 'medication':
        return <Pill className="w-4 h-4 text-amber-600" />;
      case 'health_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 max-w-[92vw] bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-150">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <span className="font-semibold text-sm text-slate-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
              <Bell className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-700">No notifications yet</p>
            <p className="text-xs text-slate-400 mt-0.5">You're all caught up on pet care alerts</p>
          </div>
        ) : (
          notifications.map(item => (
            <div
              key={item.id}
              className={`p-3.5 transition-colors flex items-start gap-3 hover:bg-slate-50/80 ${
                !item.read ? 'bg-teal-50/30' : 'bg-white'
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => {
                  if (!item.read) onMarkRead(item.id);
                  if (item.linkTab) {
                    onSelectTab(item.linkTab);
                    onClose();
                  }
                }}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className={`text-xs font-semibold truncate ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {item.message}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0 self-center">
                {!item.read && (
                  <button
                    onClick={() => onMarkRead(item.id)}
                    title="Mark as read"
                    className="p-1 text-slate-400 hover:text-teal-600 rounded transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(item.id)}
                  title="Delete"
                  className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-500">
          Real-time updates enabled · Automated alerts for schedules
        </span>
      </div>
    </div>
  );
};
