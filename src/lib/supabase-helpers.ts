import { supabase } from "@/integrations/supabase/client";

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function getUserCourses(userId: string) {
  const { data } = await supabase
    .from("user_courses")
    .select("*, course:courses(*)")
    .eq("user_id", userId);
  return data || [];
}

export async function getAllCourses() {
  const { data } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order");
  return data || [];
}

export async function getCourseWithModules(courseId: string) {
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .maybeSingle();

  const { data: modules } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", courseId)
    .order("sort_order");

  // Sort lessons within each module
  if (modules) {
    modules.forEach(m => {
      if (m.lessons) {
        (m.lessons as any[]).sort((a: any, b: any) => a.sort_order - b.sort_order);
      }
    });
  }

  return { course, modules: modules || [] };
}

export async function getLessonProgress(userId: string, lessonIds: string[]) {
  if (!lessonIds.length) return [];
  const { data } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);
  return data || [];
}

export async function markLessonComplete(userId: string, lessonId: string) {
  const { data } = await supabase
    .from("lesson_progress")
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" })
    .select()
    .maybeSingle();
  return data;
}

export async function purchaseCourse(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from("user_courses")
    .insert({ user_id: userId, course_id: courseId })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: { full_name?: string; avatar_url?: string }) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function isAdmin(userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}
