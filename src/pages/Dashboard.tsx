import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { getUserProfile, getUserCourses, getAllCourses, isAdmin } from "@/lib/supabase-helpers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lock, Play, Trophy } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getUserProfile(user.id),
      getUserCourses(user.id),
      getAllCourses(),
      isAdmin(user.id),
    ]).then(([p, uc, ac, admin]) => {
      setProfile(p);
      setUserCourses(uc);
      setAllCourses(ac);
      setUserIsAdmin(admin);
      setLoading(false);
    });
  }, [user]);

  const purchasedIds = new Set(userCourses.map((uc: any) => uc.course_id));

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Olá, {profile?.full_name || (userIsAdmin ? "Administrador" : "Aluno")}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            {userIsAdmin
              ? "Gerencie cursos, módulos e acompanhe o desempenho da plataforma."
              : "Continue de onde parou e avance na sua jornada."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{userCourses.length}</p>
                <p className="text-sm text-muted-foreground">Cursos ativos</p>
              </div>
            </div>
          </Card>
          <Card className="border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Trophy className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{allCourses.length - userCourses.length}</p>
                <p className="text-sm text-muted-foreground">Cursos disponíveis</p>
              </div>
            </div>
          </Card>
          <Card className="border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Play className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{Math.round((userCourses.length / Math.max(allCourses.length, 1)) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Progresso geral</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Course List */}
        <div>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Seus Cursos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allCourses.map(course => {
              const owned = purchasedIds.has(course.id);
              return (
                <Card key={course.id} className={`border-border bg-card p-6 transition-all hover:border-primary/30 ${!owned ? "opacity-75" : ""}`}>
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="font-display text-lg font-semibold text-foreground">{course.title}</h3>
                    {!owned && <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />}
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                  {owned ? (
                    <Link to={`/course/${course.id}`}>
                      <Button className="w-full">Continuar</Button>
                    </Link>
                  ) : (
                    <Link to={`/unlock/${course.id}`}>
                      <Button variant="outline" className="w-full">
                        Desbloquear - R${Number(course.price).toFixed(2).replace('.', ',')}
                      </Button>
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
