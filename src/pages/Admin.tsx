import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { isAdmin as checkAdmin, getAllCourses } from "@/lib/supabase-helpers";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, Save, BookOpen, Layers, Video } from "lucide-react";

const Admin = () => {
  const { user } = useAuth();
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");

  // New course form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // New module form
  const [newModuleTitle, setNewModuleTitle] = useState("");

  // New lesson form
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonUrl, setNewLessonUrl] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("");

  useEffect(() => {
    if (!user) return;
    checkAdmin(user.id).then(setAdmin);
  }, [user]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) loadModules(selectedCourse);
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedModule) loadLessons(selectedModule);
  }, [selectedModule]);

  const loadCourses = async () => {
    const data = await getAllCourses();
    setCourses(data);
    if (data.length > 0 && !selectedCourse) setSelectedCourse(data[0].id);
  };

  const loadModules = async (courseId: string) => {
    const { data } = await supabase.from("modules").select("*").eq("course_id", courseId).order("sort_order");
    setModules(data || []);
    if (data && data.length > 0) setSelectedModule(data[0].id);
    else setSelectedModule("");
  };

  const loadLessons = async (moduleId: string) => {
    const { data } = await supabase.from("lessons").select("*").eq("module_id", moduleId).order("sort_order");
    setLessons(data || []);
  };

  const addCourse = async () => {
    if (!newTitle) return;
    const { error } = await supabase.from("courses").insert({
      title: newTitle,
      description: newDesc,
      price: parseFloat(newPrice) || 0,
      sort_order: courses.length + 1,
    });
    if (error) toast.error(error.message);
    else { toast.success("Curso criado!"); setNewTitle(""); setNewDesc(""); setNewPrice(""); loadCourses(); }
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Curso removido!"); loadCourses(); }
  };

  const addModule = async () => {
    if (!newModuleTitle || !selectedCourse) return;
    const { error } = await supabase.from("modules").insert({
      course_id: selectedCourse,
      title: newModuleTitle,
      sort_order: modules.length + 1,
    });
    if (error) toast.error(error.message);
    else { toast.success("Módulo criado!"); setNewModuleTitle(""); loadModules(selectedCourse); }
  };

  const deleteModule = async (id: string) => {
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Módulo removido!"); loadModules(selectedCourse); }
  };

  const addLesson = async () => {
    if (!newLessonTitle || !selectedModule) return;
    const { error } = await supabase.from("lessons").insert({
      module_id: selectedModule,
      title: newLessonTitle,
      video_url: newLessonUrl,
      duration_minutes: parseInt(newLessonDuration) || 0,
      sort_order: lessons.length + 1,
    });
    if (error) toast.error(error.message);
    else { toast.success("Aula criada!"); setNewLessonTitle(""); setNewLessonUrl(""); setNewLessonDuration(""); loadLessons(selectedModule); }
  };

  const deleteLesson = async (id: string) => {
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Aula removida!"); loadLessons(selectedModule); }
  };

  if (admin === null) return <AppLayout><div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></AppLayout>;
  if (!admin) return <Navigate to="/dashboard" />;

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground md:text-3xl">Painel Admin</h1>
        <p className="mb-8 text-muted-foreground">Gerencie cursos, módulos e aulas.</p>

        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses" className="gap-2"><BookOpen className="h-4 w-4" />Cursos</TabsTrigger>
            <TabsTrigger value="modules" className="gap-2"><Layers className="h-4 w-4" />Módulos</TabsTrigger>
            <TabsTrigger value="lessons" className="gap-2"><Video className="h-4 w-4" />Aulas</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card className="border-border bg-card p-6 mb-6">
              <h3 className="mb-4 font-display font-semibold text-foreground">Novo Curso</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div><Label>Título</Label><Input value={newTitle} onChange={e => setNewTitle(e.target.value)} /></div>
                <div><Label>Preço (R$)</Label><Input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} /></div>
                <div className="flex items-end"><Button onClick={addCourse} className="gap-2"><Plus className="h-4 w-4" />Adicionar</Button></div>
              </div>
              <div className="mt-3"><Label>Descrição</Label><Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} /></div>
            </Card>
            <div className="space-y-3">
              {courses.map(c => (
                <Card key={c.id} className="flex items-center justify-between border-border bg-card p-4">
                  <div>
                    <p className="font-medium text-foreground">{c.title}</p>
                    <p className="text-sm text-muted-foreground">R${Number(c.price).toFixed(2)} {c.is_entry_course && "• Curso de entrada"}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteCourse(c.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="modules">
            <div className="mb-4">
              <Label>Selecionar Curso</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <Card className="border-border bg-card p-6 mb-6">
              <h3 className="mb-4 font-display font-semibold text-foreground">Novo Módulo</h3>
              <div className="flex gap-4">
                <div className="flex-1"><Label>Título</Label><Input value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} /></div>
                <div className="flex items-end"><Button onClick={addModule} className="gap-2"><Plus className="h-4 w-4" />Adicionar</Button></div>
              </div>
            </Card>
            <div className="space-y-3">
              {modules.map(m => (
                <Card key={m.id} className="flex items-center justify-between border-border bg-card p-4">
                  <p className="font-medium text-foreground">{m.title}</p>
                  <Button variant="ghost" size="icon" onClick={() => deleteModule(m.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lessons">
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <div>
                <Label>Curso</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <Label>Módulo</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={selectedModule} onChange={e => setSelectedModule(e.target.value)}>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>
            </div>
            <Card className="border-border bg-card p-6 mb-6">
              <h3 className="mb-4 font-display font-semibold text-foreground">Nova Aula</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div><Label>Título</Label><Input value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)} /></div>
                <div><Label>URL do Vídeo (embed)</Label><Input value={newLessonUrl} onChange={e => setNewLessonUrl(e.target.value)} placeholder="https://youtube.com/embed/..." /></div>
                <div><Label>Duração (min)</Label><Input type="number" value={newLessonDuration} onChange={e => setNewLessonDuration(e.target.value)} /></div>
              </div>
              <div className="mt-4"><Button onClick={addLesson} className="gap-2"><Plus className="h-4 w-4" />Adicionar Aula</Button></div>
            </Card>
            <div className="space-y-3">
              {lessons.map(l => (
                <Card key={l.id} className="flex items-center justify-between border-border bg-card p-4">
                  <div>
                    <p className="font-medium text-foreground">{l.title}</p>
                    <p className="text-sm text-muted-foreground">{l.duration_minutes}min • {l.video_url ? "Com vídeo" : "Sem vídeo"}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteLesson(l.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Admin;
