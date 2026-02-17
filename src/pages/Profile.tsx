import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { getUserProfile, getUserCourses, updateProfile } from "@/lib/supabase-helpers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookOpen, Mail, Calendar } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([getUserProfile(user.id), getUserCourses(user.id)]).then(([p, c]) => {
      setProfile(p);
      setCourses(c);
      setName(p?.full_name || "");
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, { full_name: name });
      setProfile(updated);
      toast.success("Perfil atualizado!");
    } catch {
      toast.error("Erro ao atualizar.");
    }
    setSaving(false);
  };

  if (loading) return <AppLayout><div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Meu Perfil</h1>

        <Card className="border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Dados Pessoais</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user?.email}
              </div>
            </div>
            <div>
              <Label>Membro desde</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(profile?.created_at).toLocaleDateString("pt-BR")}
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Cursos Adquiridos</h2>
          {courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum curso adquirido ainda.</p>
          ) : (
            <div className="space-y-3">
              {courses.map((uc: any) => (
                <div key={uc.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{uc.course?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Adquirido em {new Date(uc.purchased_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
