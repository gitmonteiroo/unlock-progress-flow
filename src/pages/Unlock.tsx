import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { purchaseCourse, getUserCourses } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

const Unlock = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      supabase.from("courses").select("*").eq("id", id).maybeSingle(),
      getUserCourses(user.id),
    ]).then(([{ data: c }, uc]) => {
      setCourse(c);
      setAlreadyOwned(uc.some((u: any) => u.course_id === id));
      setLoading(false);
    });
  }, [user, id]);

  const handlePurchase = async () => {
    if (!user || !id) return;
    setPurchasing(true);
    try {
      await purchaseCourse(user.id, id);
      toast.success("Curso desbloqueado com sucesso!");
      navigate(`/course/${id}`);
    } catch (err: any) {
      toast.error("Erro ao desbloquear. Tente novamente.");
    }
    setPurchasing(false);
  };

  if (loading) return <AppLayout><div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></AppLayout>;
  if (!course) return <Navigate to="/courses" />;
  if (alreadyOwned) return <Navigate to={`/course/${id}`} />;

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="rounded-xl border border-border bg-card p-8 md:p-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            Oferta Exclusiva
          </div>

          <h1 className="mb-4 font-display text-3xl font-bold text-foreground">{course.title}</h1>
          <p className="mb-8 text-lg text-muted-foreground">{course.description}</p>

          {course.benefits && course.benefits.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">O que você vai aprender:</h3>
              <ul className="space-y-3">
                {course.benefits.map((b: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <CheckCircle className="h-5 w-5 shrink-0 text-success" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-8 flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <ShieldCheck className="h-5 w-5 text-success" />
            <span className="text-sm text-muted-foreground">Acesso vitalício • Garantia de 7 dias</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-4xl font-bold text-foreground">
                R${Number(course.price).toFixed(2).replace('.', ',')}
              </span>
              <p className="mt-1 text-sm text-muted-foreground">Pagamento único</p>
            </div>
            <Button size="lg" className="h-14 px-10 text-lg font-semibold" onClick={handlePurchase} disabled={purchasing}>
              {purchasing ? "Processando..." : "Desbloquear Agora"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Unlock;
