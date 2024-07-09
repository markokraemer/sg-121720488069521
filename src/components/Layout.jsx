import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  BarChart3, 
  Settings, 
  Bell,
  Search
} from 'lucide-react';

export const Layout = ({ children }) => {
  const router = useRouter();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Contacts', href: '/contacts' },
    { icon: Target, label: 'Leads', href: '/leads' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">CRM Pro</h1>
        </div>
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <Link href={item.href} key={index}>
              <span className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${
                router.pathname === item.href ? 'bg-gray-200' : ''
              }`}>
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 mr-4"
              />
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-2">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/api/placeholder/32/32" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};