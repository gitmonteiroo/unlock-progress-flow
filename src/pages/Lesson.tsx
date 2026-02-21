import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { markLessonComplete, getLessonProgress, getUserCourses } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, ArrowLeft, FileDown, Sparkles, Unlock } from "lucide-react";
import { toast } from "sonner";

const UPSELL_COURSE_ID = "2c9996cd-b0cb-4d9d-a3c3-acb6584bc0ab";
const ENTRY_COURSE_ID = "776f38e4-90c0-42f1-9472-dd22469fda2a";

const Lesson = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [ownsUpsell, setOwnsUpsell] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    loadLesson();
  }, [user, id]);

  const loadLesson = async () => {
    setLoading(true);
    // Get lesson
    const { data: lessonData } = await supabase
      .from("lessons")
      .select("*, module:modules(*, course:courses(*))")
      .eq("id", id!)
      .maybeSingle();

    if (!lessonData) { setLoading(false); return; }
    setLesson(lessonData);
    setModule(lessonData.module);

    // Get all lessons in this module
    const { data: moduleLessons } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", lessonData.module_id)
      .order("sort_order");
    setAllLessons(moduleLessons || []);

    // Check progress
    const prog = await getLessonProgress(user!.id, [id!]);
    setCompleted(prog.some((p: any) => p.completed));

    // Check if this is an entry course lesson and user doesn't own upsell
    if (lessonData.module?.course_id === ENTRY_COURSE_ID) {
      const uc = await getUserCourses(user!.id);
      const hasUpsell = uc.some((u: any) => u.course_id === UPSELL_COURSE_ID);
      setOwnsUpsell(hasUpsell);
      if (!hasUpsell) setShowUpsell(true);
    }

    setLoading(false);
  };

  const handleComplete = async () => {
    if (!user || !id) return;
    setMarking(true);
    await markLessonComplete(user.id, id);
    setCompleted(true);
    setMarking(false);
    toast.success("Aula concluída!");
  };

  if (loading) return <AppLayout><div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></AppLayout>;
  if (!lesson) return <Navigate to="/courses" />;

  const currentIdx = allLessons.findIndex((l: any) => l.id === id);
  const nextLesson = allLessons[currentIdx + 1];
  const prevLesson = allLessons[currentIdx - 1];
  const courseId = module?.course_id || module?.course?.id;

  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => navigate(`/course/${courseId}`)} className="hover:text-foreground">
            {module?.course?.title || "Curso"}
          </button>
          <span>/</span>
          <span>{module?.title}</span>
          <span>/</span>
          <span className="text-foreground">{lesson.title}</span>
        </div>

        {/* Video Player */}
        <div className="mb-6 aspect-video w-full overflow-hidden rounded-xl border border-border bg-card">
          {lesson.video_url ? (
            <iframe
              src={lesson.video_url}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Vídeo em breve
            </div>
          )}
        </div>

        {/* Lesson Info */}
        <div className="mb-6">
          <h1 className="mb-2 font-display text-2xl font-bold text-foreground">{lesson.title}</h1>
          {lesson.duration_minutes > 0 && (
            <span className="text-sm text-muted-foreground">{lesson.duration_minutes} minutos</span>
          )}
        </div>

        {/* PDF Download */}
        {lesson.pdf_url && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <FileDown className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Material complementar (eBook)</p>
              <p className="text-xs text-muted-foreground">PDF disponível para download</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => window.open(lesson.pdf_url, '_blank')}>
                Baixar PDF
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {prevLesson && (
            <Button variant="outline" onClick={() => navigate(`/lesson/${prevLesson.id}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
          )}

          {completed ? (
            <Button variant="outline" disabled className="gap-2">
              <CheckCircle className="h-4 w-4 text-success" /> Concluída
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={marking}>
              {marking ? "Salvando..." : "Marcar como Concluída"}
            </Button>
          )}

          {nextLesson ? (
            <Button onClick={() => navigate(`/lesson/${nextLesson.id}`)}>
              Próxima Aula <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate(`/course/${courseId}`)}>
              Voltar ao Curso
            </Button>
          )}
        </div>

        {/* Upsell Banner */}
        {showUpsell && !ownsUpsell && completed && (
          <div className="mt-8 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    Pronto para o próximo nível?
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Desbloqueie templates profissionais e tráfego pago simplificado por apenas R$47,00.
                  </p>
                </div>
              </div>
              <Link to="/upsell-avancado">
                <Button className="gap-2 whitespace-nowrap">
                  <Unlock className="h-4 w-4" />
                  Ver conteúdos avançados
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Lesson;
