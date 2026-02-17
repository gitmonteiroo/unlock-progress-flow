import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { getCourseWithModules, getUserCourses, getLessonProgress } from "@/lib/supabase-helpers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Play } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [owned, setOwned] = useState(false);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
                  Módulo {mi + 1}: {module.title}
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
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetail;
