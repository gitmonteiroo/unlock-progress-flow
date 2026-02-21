import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { getUserCourses, getAllCourses } from "@/lib/supabase-helpers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Play } from "lucide-react";
import negocioDigitalBanner from "@/assets/negocio-digital-banner.png";
import bannerFinanceiro from "@/assets/banner-financeiro.jpg";
import bannerProdutividade from "@/assets/banner-produtividade.jpg";
import bannerAvancado from "@/assets/banner-avancado.jpg";
import bannerEmocional from "@/assets/banner-emocional.jpg";
import bannerMarketing from "@/assets/banner-marketing.jpg";
import bannerHobbies from "@/assets/banner-hobbies.jpg";

const courseBannerMap: Record<string, string> = {
  "Negócio Digital na Prática": negocioDigitalBanner,
  "Organização Financeira do Zero": bannerFinanceiro,
  "Carreira Acelerada": bannerProdutividade,
  "Desbloqueio de Conteúdos Avançados": bannerAvancado,
  "Relacionamentos Conscientes": bannerEmocional,
  "Marketing Prático para Negócios Locais": bannerMarketing,
  "Hobbies Lucrativos & Vida Prática": bannerHobbies,
};

const Courses = () => {
  const { user } = useAuth();
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([getUserCourses(user.id), getAllCourses()]).then(([uc, ac]) => {
      setUserCourses(uc);
      setAllCourses(ac);
      setLoading(false);
    });
  }, [user]);

  const purchasedIds = new Set(userCourses.map((uc: any) => uc.course_id));

  if (loading) {
    return <AppLayout><div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground md:text-3xl">Todos os Cursos</h1>
        <p className="mb-8 text-muted-foreground">Explore nossa biblioteca de cursos e desbloqueie novos conhecimentos.</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allCourses.filter(course => course.title !== 'Desbloqueio de Conteúdos Avançados').map(course => {
            const owned = purchasedIds.has(course.id);
            return (
              <Card key={course.id} className="group relative overflow-hidden border-border bg-card transition-all hover:border-primary/30">
                {/* Course Banner */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={course.image_url || courseBannerMap[course.title] || negocioDigitalBanner}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                </div>
                <div className="relative p-6 pt-3">
                  <div className="mb-3 flex items-center gap-2">
                    {owned ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                        <Play className="h-3 w-3" /> Liberado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        <Lock className="h-3 w-3" /> Bloqueado
                      </span>
                    )}
                    {course.is_entry_course && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Entrada</span>
                    )}
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{course.title}</h3>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-foreground">
                      R${Number(course.price).toFixed(2).replace('.', ',')}
                    </span>
                    {owned ? (
                      <Link to={`/course/${course.id}`}>
                        <Button size="sm">Continuar</Button>
                      </Link>
                    ) : (
                      <Link to={`/unlock/${course.id}`}>
                        <Button size="sm" variant="outline">Desbloquear</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Courses;
