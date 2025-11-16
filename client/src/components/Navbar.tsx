import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, PenSquare, User, Settings, LogOut, Moon, Sun } from "lucide-react";

interface NavbarProps {
  isLoggedIn?: boolean;
  userAvatar?: string;
  userName?: string;
  onThemeToggle?: () => void;
  isDark?: boolean;
}

export default function Navbar({ 
  isLoggedIn = false, 
  userAvatar, 
  userName = "User",
  onThemeToggle,
  isDark = false 
}: NavbarProps) {
  const [searchExpanded, setSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" data-testid="link-home">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer hover-elevate active-elevate-2 rounded-md px-2 py-1">
              WriteWave
            </h1>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6">
          <div className={`relative transition-all duration-200 ${searchExpanded ? 'w-full max-w-md' : 'w-64'}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-9 pr-4"
              onFocus={() => setSearchExpanded(true)}
              onBlur={() => setSearchExpanded(false)}
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            data-testid="button-theme-toggle"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {isLoggedIn ? (
            <>
              <Link href="/create" data-testid="link-create">
                <Button variant="default" className="gap-2" data-testid="button-create">
                  <PenSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Write</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatar} />
                      <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" data-testid="link-profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" data-testid="link-dashboard" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="button-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" data-testid="link-login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/register" data-testid="link-register">
                <Button variant="default">Get started</Button>
              </Link>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
