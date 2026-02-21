import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { getUserProfile, getUserCourses, getAllCourses, isAdmin, getLessonProgress, getCourseWithModules } from "@/lib/supabase-helpers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lock, Play, Trophy, GraduationCap, Rocket, Star, Sparkles, Zap } from "lucide-react";
import negocioDigitalCover from "@/assets/negocio-digital-cover.png";
import negocioDigitalBanner from "@/assets/negocio-digital-banner.png";
import bannerFinanceiro from "@/assets/banner-financeiro.jpg";
import bannerProdutividade from "@/assets/banner-produtividade.jpg";
import bannerAvancado from "@/assets/banner-avancado.jpg";
import bannerEmocional from "@/assets/banner-emocional.jpg";
import bannerMarketing from "@/assets/banner-marketing.jpg";
import bannerHobbies from "@/assets/banner-hobbies.jpg";
import bannerAirfryer from "@/assets/banner-airfryer.png";

const courseBannerMap: Record<string, string> = {
  "Negócio Digital na Prática": negocioDigitalBanner,
  "Organização Financeira do Zero": bannerFinanceiro,
  "Carreira Acelerada": bannerProdutividade,
  "Desbloqueio de Conteúdos Avançados": bannerAvancado,
  "Relacionamentos Conscientes": bannerEmocional,
  "Marketing Prático para Negócios Locais": bannerMarketing,
  "Hobbies Lucrativos & Vida Prática": bannerHobbies,
  "Mestre da Airfryer": bannerAirfryer,
};

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

      // Only show current course if user has purchased courses
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

        {/* Welcome Card — only for students without courses */}
        {!userIsAdmin && userCourses.length === 0 && (
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[hsl(262,83%,15%)] via-[hsl(262,60%,20%)] to-[hsl(280,70%,12%)]">
            {/* Decorative elements */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[hsl(262,83%,58%,0.15)] blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[hsl(280,80%,50%,0.1)] blur-3xl" />
            <div className="absolute right-10 top-10 h-20 w-20 rounded-full bg-[hsl(262,83%,58%,0.08)] blur-xl" />
            <div className="absolute bottom-16 left-1/2 h-32 w-32 rounded-full bg-[hsl(200,80%,60%,0.06)] blur-2xl" />
            
            {/* Floating decorative icons */}
            <div className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(262,83%,58%,0.15)] backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-[hsl(262,83%,75%)]" />
            </div>
            <div className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(280,80%,60%,0.12)] backdrop-blur-sm">
              <Zap className="h-5 w-5 text-[hsl(280,80%,70%)]" />
            </div>
            <div className="absolute right-20 top-8 h-2 w-2 rounded-full bg-[hsl(262,83%,70%,0.5)]" />
            <div className="absolute bottom-12 left-20 h-3 w-3 rounded-full bg-[hsl(280,80%,65%,0.4)]" />
            <div className="absolute left-1/3 top-12 h-1.5 w-1.5 rounded-full bg-[hsl(200,80%,70%,0.4)]" />

            <div className="relative flex flex-col gap-8 p-8 md:flex-row md:items-center md:gap-10 md:p-12">
              {/* Video */}
              <div className="w-full md:w-[55%]">
                <div className="overflow-hidden rounded-2xl ring-1 ring-[hsl(262,83%,58%,0.3)] shadow-[0_8px_40px_-12px_hsl(262,83%,58%,0.3)]">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src="https://player.vimeo.com/video/1167023274?badge=0&autopause=0&player_id=0"
                      className="absolute inset-0 h-full w-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="Vídeo de boas-vindas"
                    />
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-1 flex-col items-center gap-5 text-center md:items-start md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(262,83%,58%,0.2)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[hsl(262,83%,80%)]">
                  <Rocket className="h-3.5 w-3.5" />
                  Sua jornada começa aqui
                </div>
                <h2 className="font-display text-2xl font-bold leading-tight text-white md:text-3xl">
                  Seja bem-vindo(a) ao<br />
                  <span className="bg-gradient-to-r from-[hsl(262,83%,70%)] to-[hsl(280,80%,70%)] bg-clip-text text-transparent">
                    Hub Negócios Digitais!
                  </span>
                </h2>
                <p className="max-w-sm text-[hsl(220,20%,70%)]">
                  Sua trilha de aprendizado começa agora! Explore os cursos abaixo e desbloqueie o conhecimento que vai transformar sua jornada.
                </p>
                <div className="mt-1 flex items-center gap-2 rounded-full bg-[hsl(262,83%,58%,0.15)] px-5 py-2.5 text-sm font-medium text-[hsl(262,83%,80%)] ring-1 ring-[hsl(262,83%,58%,0.2)]">
                  <Star className="h-4 w-4 text-[hsl(38,92%,60%)]" />
                  Escolha seu primeiro curso e comece hoje
                </div>
              </div>
            </div>
          </Card>
        )}

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
            {allCourses.filter(course => course.title !== 'Desbloqueio de Conteúdos Avançados').map(course => {
              const owned = purchasedIds.has(course.id);
              return (
                <Card key={course.id} className={`overflow-hidden border-border bg-card transition-all hover:border-primary/30 ${!owned ? "opacity-75" : ""}`}>
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={course.image_url || courseBannerMap[course.title] || negocioDigitalBanner}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  </div>
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
