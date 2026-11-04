import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Lock, LogIn, LogOut, Menu, UserCircle, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { BrandMark } from '@/components/portal/BrandMark';
import { modules, type PortalModule } from '@/config/modules';
import { branding } from '@/config/branding';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const groups: { label: string; items: PortalModule[] }[] = [
  { label: 'FTA Tools', items: modules.filter((m) => m.group === 'tools') },
  { label: 'FTA Markets', items: modules.filter((m) => m.group === 'markets') },
];

const direct = [
  { label: 'Free Trade Agreements', to: '/trade-agreements' },
  { label: 'Knowledge', to: '/knowledge-support' },
];

// Header accepts legacy props for compatibility with older pages.
export function Header(_props: { isLandingPage?: boolean } = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, signOut, user } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const groupActive = (items: PortalModule[]) => items.some((i) => location.pathname.startsWith(i.path));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-8 items-center justify-between gap-4 text-[11px] sm:text-xs">
          <span className="truncate">
            <span className="font-semibold">{branding.governmentName}</span>
            <span className="opacity-80"> · An {branding.departmentShort} initiative</span>
          </span>
          <span className="hidden md:flex items-center gap-3 opacity-90">
            <a href={`mailto:${branding.contactEmail}`} className="hover:underline">{branding.contactEmail}</a>
            <span aria-hidden>|</span>
            <a href={`tel:${branding.contactPhone.replace(/[^\d+]/g, '')}`} className="hover:underline">{branding.helplineLabel}: {branding.contactPhone}</a>
          </span>
        </div>
      </div>
      <div className="tricolour-rule h-[3px]" aria-hidden />
      <div className="container flex min-h-16 items-center justify-between gap-4 py-2">
        <Link to="/" aria-label="Portal home">
          <BrandMark labelClassName="hidden sm:block xl:hidden 2xl:block" />
        </Link>

        <nav className="hidden xl:flex items-center gap-1" aria-label="Primary">
          {groups.map((g) => (
            <DropdownMenu key={g.label} modal={false}>
              <DropdownMenuTrigger
                className={cn(
                  'flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary',
                  groupActive(g.items) ? 'text-primary' : 'text-foreground/80',
                )}
              >
                {g.label} <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" collisionPadding={12} className="w-80 p-1 scroll-panel">
                <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">{g.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {g.items.map((m) => (
                  <DropdownMenuItem key={m.id} asChild className="cursor-pointer items-start gap-3 py-2">
                    <Link to={m.path}>
                      <m.icon className="h-4 w-4 mt-0.5 text-primary" />
                      <span className="flex-1">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          {m.title}
                          {m.comingSoon && <span className="ml-1 inline-block shrink-0 whitespace-nowrap rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">Coming soon</span>}
                          {m.requiresLogin && <Lock className="h-3 w-3 text-muted-foreground" aria-label="Sign-in required" />}
                        </span>
                        <span className="block text-xs text-muted-foreground line-clamp-2">{m.description}</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          {direct.map((d) => (
            <NavLink
              key={d.to}
              to={d.to}
              className={({ isActive }) =>
                cn('whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary', isActive ? 'text-primary' : 'text-foreground/80')
              }
            >
              {d.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <UserCircle className="h-4 w-4" />
                  {user?.first_name || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/tariff-savings-calculator">Global Duty Calculator</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" variant="outline" asChild>
              <Link to="/signin"><LogIn className="mr-2 h-4 w-4" />Sign in</Link>
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <div className="xl:hidden border-t bg-card max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-contain scroll-panel">
          <nav className="container py-4 space-y-5" aria-label="Mobile">
            {groups.map((g) => (
              <div key={g.label}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</p>
                <div className="grid sm:grid-cols-2 gap-1">
                  {g.items.map((m) => (
                    <Link key={m.id} to={m.path} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
                      <m.icon className="h-4 w-4 text-primary" /> {m.title}
                      {m.comingSoon && <span className="ml-1 inline-block shrink-0 whitespace-nowrap rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">Coming soon</span>}
                      {m.requiresLogin && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explore</p>
              <div className="grid sm:grid-cols-2 gap-1">
                {direct.map((d) => (
                  <Link key={d.to} to={d.to} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm hover:bg-muted">{d.label}</Link>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild><Link to="/profile" onClick={() => setOpen(false)}>Profile</Link></Button>
                  <Button variant="outline" size="sm" onClick={() => { handleSignOut(); setOpen(false); }}>Sign out</Button>
                </div>
              ) : (
                <Button size="sm" asChild><Link to="/signin" onClick={() => setOpen(false)}>Sign in</Link></Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
