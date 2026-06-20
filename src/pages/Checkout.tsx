import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import hubLogo from "@/assets/hub-logo.png";

const COURSE_ID = "776f38e4-90c0-42f1-9472-dd22469fda2a"; // Negócio Digital na Prática

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?redirect=/checkout");
    }
  }, [user, authLoading, navigate]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { course_id: COURSE_ID },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não retornada");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao iniciar checkout");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={hubLogo} alt="Hub Negócios Digitais" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-display text-xl font-bold text-foreground">Hub Negócios Digitais</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Finalizar Compra</h1>
        <p className="mb-8 text-muted-foreground">Revise seu pedido e conclua o pagamento.</p>

        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Negócio Digital na Prática</h2>
              <p className="text-sm text-muted-foreground">Acesso vitalício ao curso completo</p>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl font-bold text-foreground">R$7,90</div>
              <div className="text-xs text-muted-foreground">pagamento único</div>
            </div>
          </div>

          <ul className="mb-8 space-y-3 border-t border-border pt-6">
            {["Passo a passo completo", "Estratégias validadas", "Suporte da comunidade", "Acesso vitalício"].map((b, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                <CheckCircle className="h-5 w-5 text-success" />
                {b}
              </li>
            ))}
          </ul>

          <Button onClick={handleCheckout} disabled={loading} size="lg" className="w-full h-14 text-lg font-semibold">
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...</>
            ) : (
              "Finalizar Compra"
            )}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Pagamento seguro processado por Stripe
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
