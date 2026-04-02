import { Link, useLocation } from "wouter";
import { Activity, Search, Database, Bookmark, Info, Menu, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useHealthCheck } from "@workspace/api-client-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/", label: "Home", icon: Activity },
  { href: "/search", label: "Search", icon: Search },
  { href: "/domains", label: "Domains", icon: Database },
  { href: "/indicators", label: "Indicators", icon: Activity },
  { href: "/saved", label: "Evidence Tray", icon: Bookmark },
  { href: "/about", label: "About", icon: Info },
];

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-primary tracking-tight">JMH Portal</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent location={location} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-card/50">
        <SidebarContent location={location} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function SidebarContent({ location }: { location: string }) {
  const { data: health, isError } = useHealthCheck();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-primary tracking-tight">JMH</span>
        </div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Population Health</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          {isError ? (
            <><XCircle className="h-3 w-3 text-destructive" /> API Offline</>
          ) : health?.status === "ok" ? (
            <><CheckCircle2 className="h-3 w-3 text-green-500" /> API Online</>
          ) : (
            <><div className="h-2 w-2 rounded-full bg-muted animate-pulse" /> Connecting...</>
          )}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          v1.0.0-beta
        </div>
      </div>
    </div>
  );
}
