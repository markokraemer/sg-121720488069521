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
  Search,
  Menu
} from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from './ThemeSwitcher';

export const Layout = ({ children }) => {
  const router = useRouter();
  const { state } = useGlobalContext();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Contacts', href: '/contacts' },
    { icon: Target, label: 'Leads', href: '/leads' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const Sidebar = () => (
    <div className="h-full bg-background">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-foreground">CRM Pro</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <span className={`flex items-center px-4 py-2 text-foreground hover:bg-accent ${
              router.pathname === item.href ? 'bg-accent' : ''
            }`}>
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:block w-64 bg-card shadow-md">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 mr-4"
              />
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-center space-x-2">
              <ThemeSwitcher />
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar>
                <AvatarImage src={state.user?.image || "/placeholder.png"} alt={state.user?.name || "User"} />
                <AvatarFallback>{state.user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};