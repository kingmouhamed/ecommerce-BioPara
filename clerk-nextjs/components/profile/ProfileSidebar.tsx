"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  CreditCard, 
  Settings, 
  LogOut,
  ShoppingBag,
  ChevronLeft
} from "lucide-react";

interface ProfileSidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  className = "",
  isMobile = false,
  onClose,
}) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      id: "orders",
      label: "طلباتي",
      href: "/dashboard/orders",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "addresses",
      label: "العناوين",
      href: "/dashboard/addresses",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      id: "favorites",
      label: "المفضلة",
      href: "/dashboard/favorites",
      icon: <Heart className="w-5 h-5" />,
    },
    {
      id: "credits",
      label: "رصيدي",
      href: "/dashboard/credits",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "الإعدادات",
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    // Handle logout logic here
    // This would typically clear user session and redirect to login
    window.location.href = "/auth/login";
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-emerald-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">حسابي</h2>
              <p className="text-emerald-100 text-sm">مرحباً بك</p>
            </div>
          </div>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-emerald-700 p-2 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`${isActive(item.href) ? "text-emerald-600" : "text-gray-500"}`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            إجراءات سريعة
          </h3>
          <div className="space-y-2">
            <Link
              href="/products"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-gray-500" />
              <span className="font-medium">تسوق الآن</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-right"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            الدعم والمساعدة
          </h3>
          <div className="space-y-2">
            <Link
              href="/contact"
              className="block text-sm text-gray-600 hover:text-emerald-600 hover:underline"
            >
              اتصل بنا
            </Link>
            <Link
              href="/help"
              className="block text-sm text-gray-600 hover:text-emerald-600 hover:underline"
            >
              مركز المساعدة
            </Link>
            <Link
              href="/faq"
              className="block text-sm text-gray-600 hover:text-emerald-600 hover:underline"
            >
              الأسئلة الشائعة
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
