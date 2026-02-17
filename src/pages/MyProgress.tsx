import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { getUserCourses, getCourseWithModules, getLessonProgress } from "@/lib/supabase-helpers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const MyProgress = () => {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    const uc = await getUserCourses(user!.id);
    const results = await Promise.all(
      uc.map(async (item: any) => {
        const { course, modules } = await getCourseWithModules(item.course_id);
        const allLessons = modules.flatMap((m: any) => m.lessons || []);
        const lessonIds = allLessons.map((l: any) => l.id);
        const progress = await getLessonProgress(user!.id, lessonIds);
        const completed = progress.filter((p: any) => p.completed).length;
        return {
          course,
          totalLessons: allLessons.length,
          completedLessons: completed,
          pct: allLessons.length > 0 ? Math.round((completed / allLessons.length) * 100) : 0,
        };
      })
    );
    setCourseProgress(results);
    setLoading(false);
  };

  if (loading) return <AppLayout><div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground md:text-3xl">Meu Progresso</h1>
        <p className="mb-8 text-muted-foreground">Acompanhe sua evolução em cada curso.</p>

        {courseProgress.length === 0 ? (
          <Card className="border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">Você ainda não adquiriu nenhum curso.</p>
            <Link to="/courses"><Button className="mt-4">Ver Cursos</Button></Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {courseProgress.map(({ course, totalLessons, completedLessons, pct }) => (
              <Card key={course.id} className="border-border bg-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg font-semibold text-foreground">{course.title}</h3>
                  <span className="text-sm font-medium text-primary">{pct}%</span>
                </div>
                <Progress value={pct} className="mb-2 h-2" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{completedLessons} de {totalLessons} aulas concluídas</span>
                  <Link to={`/course/${course.id}`}>
                    <Button size="sm" variant="ghost">Continuar</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyProgress;
