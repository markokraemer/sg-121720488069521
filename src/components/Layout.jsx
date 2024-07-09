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
                <span className="navbar-logo">CRM Pro</span>
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