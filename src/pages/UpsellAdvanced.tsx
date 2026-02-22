import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { purchaseCourse, getUserCourses, getCourseWithModules } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Lock,
  Unlock,
  Sparkles,
  FileText,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const UPSELL_COURSE_ID = "2c9996cd-b0cb-4d9d-a3c3-acb6584bc0ab";

const UpsellAdvanced = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [firstLessonId, setFirstLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getUserCourses(user.id),
      getCourseWithModules(UPSELL_COURSE_ID),
    ]).then(([uc, { modules }]) => {
      const owned = uc.some((u: any) => u.course_id === UPSELL_COURSE_ID);
      setAlreadyOwned(owned);
      if (owned && modules.length > 0 && modules[0].lessons?.length > 0) {
        setFirstLessonId((modules[0].lessons as any[])[0].id);
      }
      if (!owned && modules.length > 0 && modules[0].lessons?.length > 0) {
        setFirstLessonId((modules[0].lessons as any[])[0].id);
      }
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!loading && alreadyOwned && firstLessonId) {
      navigate(`/lesson/${firstLessonId}`, { replace: true });
    }
  }, [loading, alreadyOwned, firstLessonId, navigate]);

  const handlePurchase = async () => {
    if (!user) return;
    setPurchasing(true);
    try {
      await purchaseCourse(user.id, UPSELL_COURSE_ID);
      toast.success("Conteúdos avançados desbloqueados!");
      if (firstLessonId) {
        navigate(`/lesson/${firstLessonId}`);
      } else {
        navigate(`/course/${UPSELL_COURSE_ID}`);
      }
    } catch {
      toast.error("Erro ao desbloquear. Tente novamente.");
    }
    setPurchasing(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  const advancedModules = [
    {
      icon: FileText,
      title: "Templates que Vendem",
      items: [
        "Templates prontos de páginas",
        "Estruturas de copy para ofertas simples",
        "Modelos aplicáveis imediatamente",
      ],
    },
    {
      icon: Target,
      title: "Tráfego Pago Simplificado",
      items: [
        "Introdução prática ao tráfego pago",
        "Estrutura básica de campanhas",
        "Erros comuns a evitar no início",
        "Foco em clareza, não em técnica avançada",
      ],
    },
  ];

  const benefits = [
    "Acesso imediato aos conteúdos avançados",
    "Aplicação prática com modelos prontos",
    "Menos tentativa e erro",
    "Continuação natural do curso atual",
    "Conteúdo exclusivo para alunos da plataforma",
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl animate-fade-in">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Exclusivo para alunos
          </div>
          <h1 className="mb-4 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
            Desbloqueie agora os conteúdos que aceleram seus resultados no digital
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Você já entendeu a base. Agora pode aplicar com estrutura profissional, sem travar e sem improvisar.
          </p>
        </div>

        {/* Modules Preview: Locked → Unlocked */}
        <div className="mb-10 space-y-4">
          {advancedModules.map((mod, i) => (
            <Card key={i} className="overflow-hidden border-border bg-card">
              <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <mod.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-base font-semibold text-foreground">{mod.title}</h3>
                  <p className="text-xs text-muted-foreground">{mod.items.length} aulas</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                  <Lock className="h-3 w-3" />
                  Bloqueado
                </div>
              </div>
              <div className="divide-y divide-border/50 px-6">
                {mod.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-3 py-3 text-sm text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 shrink-0 opacity-40" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <Card className="mb-10 border-border bg-card p-6 md:p-8">
          <h3 className="mb-5 font-display text-lg font-semibold text-foreground">
            O que você ganha com o desbloqueio:
          </h3>
          <ul className="space-y-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Clarity Block */}
        <div className="mb-10 rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Este desbloqueio não é obrigatório, mas é o{" "}
            <span className="font-medium text-foreground">próximo passo lógico</span> para quem quer
            avançar mais rápido no Negócio Digital na Prática.
          </p>
        </div>

        {/* Purchase Card */}
        <Card className="overflow-hidden border-primary/20 bg-card">
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-8 md:p-10">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Pagamento único • Sem mensalidade • Sem cobranças futuras
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-foreground">R$27,90</span>
                </div>
              </div>
              <Button
                size="lg"
                className="h-14 gap-2 px-8 text-base font-semibold md:px-10"
                onClick={handlePurchase}
                disabled={purchasing}
              >
                {purchasing ? (
                  "Processando..."
                ) : (
                  <>
                    <Unlock className="h-5 w-5" />
                    Desbloquear Conteúdos Avançados Agora
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Secondary CTA */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Prefiro continuar apenas com o conteúdo atual
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default UpsellAdvanced;
