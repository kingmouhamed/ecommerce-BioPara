"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Check, AlertCircle, Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// أنواع الإشعارات
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

// Provider للإشعارات
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // إزالة الإشعار تلقائياً إذا لم يكن مستمراً
    if (!notification.persistent) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// حاوية الإشعارات
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 left-4 z-50 space-y-2 max-w-sm w-full" dir="rtl">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// عنصر الإشعار الفردي
const NotificationItem: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    // إظهار الإشعار مع تأثير حركي
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    const iconClass = "h-5 w-5";
    switch (notification.type) {
      case "success":
        return <CheckCircle className={cn(iconClass, "text-green-500")} />;
      case "error":
        return <XCircle className={cn(iconClass, "text-red-500")} />;
      case "warning":
        return <AlertTriangle className={cn(iconClass, "text-yellow-500")} />;
      case "info":
        return <Info className={cn(iconClass, "text-blue-500")} />;
      default:
        return <Info className={cn(iconClass, "text-gray-500")} />;
    }
  };

  const getBackgroundClass = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTextClass = () => {
    switch (notification.type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border shadow-lg transition-all duration-300 transform",
        getBackgroundClass(),
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="flex items-start gap-3">
        {/* الأيقونة */}
        <div className="flex-shrink-0">
          {getIcon()}
        </div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-medium text-sm", getTextClass())}>
            {notification.title}
          </h4>
          {notification.message && (
            <p className={cn("text-sm mt-1", getTextClass(), "opacity-90")}>
              {notification.message}
            </p>
          )}
          
          {/* زر الإجراء */}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className={cn(
                "mt-2 text-sm font-medium underline",
                getTextClass()
              )}
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {/* زر الإغلاق */}
        <button
          onClick={handleClose}
          className={cn(
            "flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors",
            getTextClass()
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Hooks مساعدة للإشعارات الشائعة
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  const showSuccess = useCallback((title: string, message?: string) => {
    addNotification({ type: "success", title, message });
  }, [addNotification]);

  const showError = useCallback((title: string, message?: string) => {
    addNotification({ type: "error", title, message, persistent: true });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message?: string) => {
    addNotification({ type: "warning", title, message });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message?: string) => {
    addNotification({ type: "info", title, message });
  }, [addNotification]);

  const showCartAdded = useCallback((productName: string) => {
    addNotification({
      type: "success",
      title: "تمت الإضافة للسلة",
      message: `${productName} تم إضافته بنجاح إلى سلة التسوق`,
      action: {
        label: "عرض السلة",
        onClick: () => {
          // Use router instead of window.location to avoid SSR issues
          const router = useRouter();
          if (typeof window !== 'undefined') {
            router.push('/cart');
          }
        }
      }
    });
  }, [addNotification]);

  const showWishlistAdded = useCallback((productName: string) => {
    addNotification({
      type: "success",
      title: "تمت الإضافة للمفضلة",
      message: `${productName} تم إضافته إلى قائمتك المفضلة`,
      action: {
        label: "عرض المفضلة",
        onClick: () => {
          const router = useRouter();
          if (typeof window !== 'undefined') {
            router.push('/favorites');
          }
        }
      }
    });
  }, [addNotification]);

  const showOrderSuccess = useCallback((orderNumber: string) => {
    addNotification({
      type: "success",
      title: "تم تأكيد الطلب بنجاح",
      message: `رقم طلبك: ${orderNumber}`,
      persistent: true,
      action: {
        label: "عرض الطلب",
        onClick: () => {
          const router = useRouter();
          if (typeof window !== 'undefined') {
            router.push(`/orders/${orderNumber}`);
          }
        }
      }
    });
  }, [addNotification]);

  const showLoginRequired = useCallback(() => {
    addNotification({
      type: "warning",
      title: "مطلوب تسجيل الدخول",
      message: "يرجى تسجيل الدخول لإكمال هذه العملية",
      action: {
        label: "تسجيل الدخول",
        onClick: () => {
          const router = useRouter();
          if (typeof window !== 'undefined') {
            router.push('/login');
          }
        }
      }
    });
  }, [addNotification]);

  const showNetworkError = useCallback(() => {
    addNotification({
      type: "error",
      title: "خطأ في الاتصال",
      message: "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى",
      persistent: true
    });
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCartAdded,
    showWishlistAdded,
    showOrderSuccess,
    showLoginRequired,
    showNetworkError,
  };
};

// مكون الإشعار المنبثق (Toast)
export const Toast: React.FC<{
  show: boolean;
  type: NotificationType;
  title: string;
  message?: string;
  onClose: () => void;
}> = ({ show, type, title, message, onClose }) => {
  if (!show) return null;

  const getIcon = () => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case "success":
        return <CheckCircle className={cn(iconClass, "text-green-500")} />;
      case "error":
        return <XCircle className={cn(iconClass, "text-red-500")} />;
      case "warning":
        return <AlertTriangle className={cn(iconClass, "text-yellow-500")} />;
      case "info":
        return <Info className={cn(iconClass, "text-blue-500")} />;
      default:
        return <Info className={cn(iconClass, "text-gray-500")} />;
    }
  };

  const getBackgroundClass = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300",
          getBackgroundClass()
        )}
      >
        {getIcon()}
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          {message && <p className="text-xs opacity-90">{message}</p>}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// مكون شريط التقدم للإشعارات
export const ProgressNotification: React.FC<{
  show: boolean;
  title: string;
  progress: number;
  message?: string;
  onCancel?: () => void;
}> = ({ show, title, progress, message, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-80">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{title}</h4>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {message && (
          <p className="text-sm text-gray-600 mb-3">{message}</p>
        )}
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-xs text-gray-500 mt-1">{progress}%</p>
      </div>
    </div>
  );
};

export default NotificationProvider;
