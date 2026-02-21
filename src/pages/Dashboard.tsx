import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { getUserProfile, getUserCourses, getAllCourses, isAdmin, getLessonProgress, getCourseWithModules } from "@/lib/supabase-helpers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lock, Play, Trophy, GraduationCap } from "lucide-react";
import negocioDigitalCover from "@/assets/negocio-digital-cover.png";
import negocioDigitalBanner from "@/assets/negocio-digital-banner.png";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [currentCourseProgress, setCurrentCourseProgress] = useState(0);
  const [currentCourse, setCurrentCourse] = useState<any>(null);

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

      // Find the current course: first purchased, or the entry course
      if (uc.length > 0) {
        const firstCourse = uc[0];
        const courseData = ac.find((c: any) => c.id === firstCourse.course_id);
        setCurrentCourse(courseData);

        getCourseWithModules(firstCourse.course_id).then(({ modules }) => {
          const allLessonIds = modules.flatMap((m: any) => (m.lessons || []).map((l: any) => l.id));
          if (allLessonIds.length === 0) return;
          getLessonProgress(user.id, allLessonIds).then((progress) => {
            const completed = progress.filter((p: any) => p.completed).length;
            setCurrentCourseProgress(Math.round((completed / allLessonIds.length) * 100));
          });
        });
      } else {
        // Show the entry course as the featured course
        const entryCourse = ac.find((c: any) => c.is_entry_course);
        if (entryCourse) {
          setCurrentCourse(entryCourse);
        }
      }
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

        {/* BLOCO 1 — Curso Atual */}
        {currentCourse && (
          <Card className="overflow-hidden border-primary/20 bg-card">
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 md:w-48">
                <img
                  src={currentCourse.image_url || negocioDigitalCover}
                  alt={currentCourse.title}
                  className="h-48 w-full object-cover md:h-full"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-4 p-6">
                <div className="flex items-center gap-2 text-primary">
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Curso Atual</span>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
                  {currentCourse.title}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-semibold text-primary">{currentCourseProgress}%</span>
                  </div>
                  <Progress value={currentCourseProgress} className="h-3" />
                </div>
                <p className="text-sm text-muted-foreground">Este é o seu ponto de partida</p>
                <Link to={purchasedIds.has(currentCourse.id) ? `/course/${currentCourse.id}` : `/unlock/${currentCourse.id}`}>
                  <Button size="lg" className="w-full md:w-auto">
                    <Play className="mr-2 h-4 w-4" /> {purchasedIds.has(currentCourse.id) ? "Continuar curso" : `Começar por R$${Number(currentCourse.price).toFixed(2).replace('.', ',')}`}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

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
                <Card key={course.id} className={`overflow-hidden border-border bg-card transition-all hover:border-primary/30 ${!owned ? "opacity-75" : ""}`}>
                  {course.is_entry_course && (
                    <div className="relative h-52 w-full overflow-hidden">
                      <img
                        src={course.image_url || negocioDigitalBanner}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                    </div>
                  )}
                  <div className="p-6">
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
                  </div>
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
