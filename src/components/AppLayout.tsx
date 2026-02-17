import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, BookOpen, BarChart3, User, HelpCircle, LogOut, Menu, X, Shield } from "lucide-react";
import hubLogo from "@/assets/hub-logo.png";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { isAdmin } from "@/lib/supabase-helpers";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/courses", icon: BookOpen, label: "Cursos" },
  { to: "/progress", icon: BarChart3, label: "Meu Progresso" },
  { to: "/profile", icon: User, label: "Perfil" },
  { to: "/support", icon: HelpCircle, label: "Suporte" },
];

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      isAdmin(user.id).then(setUserIsAdmin);
    }
  }, [user]);

  return (
    <div className="dark flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-6">
        <Link to="/dashboard" className="mb-8 flex items-center gap-2">
          <img src={hubLogo} alt="Hub Negócios Digitais" className="h-10 w-10 rounded-lg object-cover" />
          <span className="font-display text-sm font-bold leading-tight text-foreground">Hub Negócios<br/>Digitais</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          {userIsAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/admin")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>
        <Button variant="ghost" className="mt-auto justify-start gap-3 text-muted-foreground" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={hubLogo} alt="Hub Negócios Digitais" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-display text-sm font-bold leading-tight text-foreground">Hub Negócios Digitais</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="border-b border-border bg-card p-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              {userIsAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <Button variant="ghost" className="justify-start gap-3 text-muted-foreground" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};
