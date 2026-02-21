import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { markLessonComplete, getLessonProgress } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, ArrowLeft, FileDown } from "lucide-react";
import { toast } from "sonner";

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
      </div>
    </AppLayout>
  );
};

export default Lesson;
