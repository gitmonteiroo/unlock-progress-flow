import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";

const Support = () => (
  <AppLayout>
    <div className="animate-fade-in">
      <h1 className="mb-2 font-display text-2xl font-bold text-foreground md:text-3xl">Suporte</h1>
      <p className="mb-8 text-muted-foreground">Estamos aqui para ajudar!</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card p-8 text-center">
          <Mail className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">Email</h3>
          <p className="mb-4 text-sm text-muted-foreground">Envie sua dúvida e responderemos em até 24h.</p>
          <Button variant="outline" asChild>
            <a href="mailto:suporte@edupro.com">suporte@edupro.com</a>
          </Button>
        </Card>
        <Card className="border-border bg-card p-8 text-center">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">FAQ</h3>
          <p className="mb-4 text-sm text-muted-foreground">Perguntas frequentes sobre a plataforma.</p>
          <div className="space-y-3 text-left text-sm">
            <div>
              <p className="font-medium text-foreground">Como desbloquear um curso?</p>
              <p className="text-muted-foreground">Acesse a página do curso bloqueado e clique em "Desbloquear".</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Posso assistir offline?</p>
              <p className="text-muted-foreground">No momento as aulas são apenas online via streaming.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Como funciona o reembolso?</p>
              <p className="text-muted-foreground">Garantia de 7 dias após a compra.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
);

export default Support;
