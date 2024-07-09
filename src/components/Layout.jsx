import React, { useState } from 'react';
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
  Menu,
  CheckSquare,
  Mail,
  X
} from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from './ThemeSwitcher';
import { GlobalSearch } from './GlobalSearch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Layout = ({ children }) => {
  const router = useRouter();
  const { state } = useGlobalContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Contacts', href: '/contacts' },
    { icon: Target, label: 'Leads', href: '/leads' },
    { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
    { icon: Mail, label: 'Email', href: '/email' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const NavLink = ({ href, icon: Icon, label }) => (
    <Link href={href} passHref>
      <span className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        router.pathname === href ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
      }`}>
        <Icon className="w-5 h-5 mr-2" />
        {label}
      </span>
    </Link>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="flex items-center">
              <Link href="/" passHref>
                <span className="navbar-logo" title="CRM Pro">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="8" fill="currentColor"/>
                    <path d="M20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10ZM20 28C15.5817 28 12 24.4183 12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28Z" fill="white"/>
                    <path d="M20 14C16.6863 14 14 16.6863 14 20C14 23.3137 16.6863 26 20 26C23.3137 26 26 23.3137 26 20C26 16.6863 23.3137 14 20 14ZM20 24C17.7909 24 16 22.2091 16 20C16 17.7909 17.7909 16 20 16C22.2091 16 24 17.7909 24 20C24 22.2091 22.2091 24 20 24Z" fill="white"/>
                    <circle cx="20" cy="20" r="2" fill="white"/>
                  </svg>
                </span>
              </Link>
            </div>

            <nav className="navbar-links">
              {menuItems.map((item, index) => (
                <NavLink key={index} {...item} />
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <ThemeSwitcher />
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="/default-avatar.png" alt={state.user?.name || "User"} />
                    <AvatarFallback>{state.user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4">
                    {menuItems.map((item, index) => (
                      <NavLink key={index} {...item} />
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-secondary mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-secondary-foreground">
            © 2023 CRM Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};