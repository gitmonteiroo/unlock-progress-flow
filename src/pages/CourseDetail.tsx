import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { getCourseWithModules, getUserCourses, getLessonProgress } from "@/lib/supabase-helpers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Play, Lock, Sparkles, Unlock } from "lucide-react";

const UPSELL_COURSE_ID = "2c9996cd-b0cb-4d9d-a3c3-acb6584bc0ab";
const ENTRY_COURSE_ID = "776f38e4-90c0-42f1-9472-dd22469fda2a";

const FINANCE_COURSE_ID = "90f23720-e01c-4f42-89e4-1a6703f7d3c7";
const FINANCE_UPSELL_COURSE_ID = "4d2648c5-0775-439d-8347-4456beb88529";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [owned, setOwned] = useState(false);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancedModules, setAdvancedModules] = useState<any[]>([]);
  const [ownsUpsell, setOwnsUpsell] = useState(false);
  const [financeUpsellModules, setFinanceUpsellModules] = useState<any[]>([]);
  const [ownsFinanceUpsell, setOwnsFinanceUpsell] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      getCourseWithModules(id),
      getUserCourses(user.id),
    ]).then(async ([{ course, modules }, uc]) => {
      setCourse(course);
      setModules(modules);
      const isOwned = uc.some((u: any) => u.course_id === id);
      setOwned(isOwned);

      if (isOwned) {
        const allLessonIds = modules.flatMap((m: any) => (m.lessons || []).map((l: any) => l.id));
        const prog = await getLessonProgress(user.id, allLessonIds);
        setProgress(prog);
      }

      // If this is the entry course, load advanced modules
      if (id === ENTRY_COURSE_ID) {
        const hasUpsell = uc.some((u: any) => u.course_id === UPSELL_COURSE_ID);
        setOwnsUpsell(hasUpsell);
        const { modules: advMods } = await getCourseWithModules(UPSELL_COURSE_ID);
        setAdvancedModules(advMods);
      }

      // If this is the finance course, load finance upsell modules
      if (id === FINANCE_COURSE_ID) {
        const hasFinanceUpsell = uc.some((u: any) => u.course_id === FINANCE_UPSELL_COURSE_ID);
        setOwnsFinanceUpsell(hasFinanceUpsell);
        const { modules: finMods } = await getCourseWithModules(FINANCE_UPSELL_COURSE_ID);
        setFinanceUpsellModules(finMods);
      }

      setLoading(false);
    });
  }, [user, id]);

  if (loading) return <AppLayout><div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></AppLayout>;
  if (!course) return <Navigate to="/courses" />;
  if (!owned) return <Navigate to={`/unlock/${id}`} />;

  const completedIds = new Set(progress.filter((p: any) => p.completed).map((p: any) => p.lesson_id));
  const totalLessons = modules.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0);
  const completedCount = completedIds.size;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="mb-2 font-display text-2xl font-bold text-foreground md:text-3xl">{course.title}</h1>
          <p className="mb-4 text-muted-foreground">{course.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{totalLessons} aulas</span>
            <span>{completedCount} concluídas</span>
            <span className="font-medium text-primary">{progressPct}% completo</span>
          </div>
          <div className="mt-2 h-2 w-full max-w-md overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="space-y-2">
          {modules.map((module: any, mi: number) => (
            <Accordion key={module.id} type="single" collapsible defaultValue={mi === 0 ? module.id : undefined}>
              <AccordionItem value={module.id} className="rounded-lg border border-border bg-card px-4">
                <AccordionTrigger className="font-display text-base font-semibold text-foreground hover:no-underline">
                  <div className="flex items-center gap-3">
                    {module.image_url && (
                      <img src={module.image_url} alt={module.title} className="h-10 w-10 rounded-lg object-cover" />
                    )}
                    <span>Módulo {mi + 1}: {module.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pb-2">
                    {(module.lessons || []).map((lesson: any, li: number) => {
                      const done = completedIds.has(lesson.id);
                      return (
                        <Link
                          key={lesson.id}
                          to={`/lesson/${lesson.id}`}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                        >
                          {done ? (
                            <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className={done ? "text-muted-foreground" : "text-foreground"}>
                            {li + 1}. {lesson.title}
                          </span>
                          {lesson.duration_minutes > 0 && (
                            <span className="ml-auto text-xs text-muted-foreground">{lesson.duration_minutes}min</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}

          {modules.length === 0 && (
            <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
              Nenhum módulo disponível ainda. Em breve teremos conteúdo!
            </div>
          )}

          {/* Advanced Modules - Locked or Unlocked */}
          {advancedModules.length > 0 && (
            <div className="mt-10 animate-fade-in">
              {/* Persuasive Header */}
              <div className="relative mb-6 animate-scale-in overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-6 md:p-8">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-accent/10 blur-xl" />
                <div className="relative">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Exclusivo para alunos
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold text-foreground md:text-2xl">
                    🚀 Acelere seus resultados agora
                  </h3>
                  <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                    Use templates que vendem + tráfego pago simplificado para avançar mais rápido.
                  </p>
                  {!ownsUpsell && (
                    <div className="mt-4">
                      <Link to="/upsell-avancado">
                        <Button className="gap-2 shadow-lg shadow-primary/20">
                          <Lock className="h-4 w-4" />
                          👉 Desbloqueie agora por apenas R$ 27,90
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Module Cards */}
              {advancedModules.map((module: any, mi: number) => (
                <Accordion key={module.id} type="single" collapsible>
                  <AccordionItem value={module.id} className={`mb-2 rounded-lg border px-4 ${ownsUpsell ? 'border-border bg-card' : 'border-primary/10 bg-gradient-to-r from-card to-primary/[0.02]'}`}>
                    <AccordionTrigger className="font-display text-base font-semibold text-foreground hover:no-underline">
                      <div className="flex items-center gap-2">
                        {!ownsUpsell ? (
                          <Lock className="h-4 w-4 text-primary/60" />
                        ) : (
                          <Sparkles className="h-4 w-4 text-primary" />
                        )}
                        {module.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 pb-2">
                        {(module.lessons || []).map((lesson: any, li: number) => (
                          ownsUpsell ? (
                            <Link
                              key={lesson.id}
                              to={`/lesson/${lesson.id}`}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                            >
                              <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span className="text-foreground">{li + 1}. {lesson.title}</span>
                            </Link>
                          ) : (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground opacity-50"
                            >
                              <Lock className="h-3.5 w-3.5 shrink-0" />
                              <span>{li + 1}. {lesson.title}</span>
                            </div>
                          )
                        ))}
                      </div>
                      {!ownsUpsell && (
                        <div className="pb-4 pt-1">
                          <Link to="/upsell-avancado">
                            <Button size="sm" variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                              <Unlock className="h-4 w-4" />
                              Desbloquear agora
                            </Button>
                          </Link>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}

          {/* Finance Upsell Modules - Locked or Unlocked */}
          {financeUpsellModules.length > 0 && (
            <div className="mt-10 animate-fade-in">
              <div className="relative mb-6 animate-scale-in overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-6 md:p-8">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-accent/10 blur-xl" />
                <div className="relative">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Exclusivo para alunos
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold text-foreground md:text-2xl">
                    🚀 Transforme sua mentalidade financeira
                  </h3>
                  <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                    Aplique a Regra dos 90 Dias de Napoleon Hill e reprograme sua mente para a riqueza.
                  </p>
                  {!ownsFinanceUpsell && (
                    <div className="mt-4">
                      <Link to="/upsell-financeiro">
                        <Button className="gap-2 shadow-lg shadow-primary/20">
                          <Lock className="h-4 w-4" />
                          👉 Desbloqueie agora por apenas R$ 27,90
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {financeUpsellModules.map((module: any) => (
                <Accordion key={module.id} type="single" collapsible>
                  <AccordionItem value={module.id} className={`mb-2 rounded-lg border px-4 ${ownsFinanceUpsell ? 'border-border bg-card' : 'border-primary/10 bg-gradient-to-r from-card to-primary/[0.02]'}`}>
                    <AccordionTrigger className="font-display text-base font-semibold text-foreground hover:no-underline">
                      <div className="flex items-center gap-2">
                        {!ownsFinanceUpsell ? (
                          <Lock className="h-4 w-4 text-primary/60" />
                        ) : (
                          <Sparkles className="h-4 w-4 text-primary" />
                        )}
                        {module.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 pb-2">
                        {(module.lessons || []).map((lesson: any, li: number) => (
                          ownsFinanceUpsell ? (
                            <Link
                              key={lesson.id}
                              to={`/lesson/${lesson.id}`}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                            >
                              <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span className="text-foreground">{li + 1}. {lesson.title}</span>
                            </Link>
                          ) : (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground opacity-50"
                            >
                              <Lock className="h-3.5 w-3.5 shrink-0" />
                              <span>{li + 1}. {lesson.title}</span>
                            </div>
                          )
                        ))}
                      </div>
                      {!ownsFinanceUpsell && (
                        <div className="pb-4 pt-1">
                          <Link to="/upsell-financeiro">
                            <Button size="sm" variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                              <Unlock className="h-4 w-4" />
                              Desbloquear agora
                            </Button>
                          </Link>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetail;
