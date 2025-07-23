"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { graphql } from "@/lib/graphql";
import { ME, GET_TEACHER_PROFILE } from "@/graphql/queries";
import { CREATE_COURSE } from "@/graphql/mutations";

type MeResponse = { me: { id: string; role: string; name: string } };
type Course = { id: string; title: string; description: string };
type TeacherProfile = {
  id: string;
  subject: { id: string; name: string };
  courses: Course[];
};

export default function TeacherCoursesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  // 1️⃣ Fetch current user
  useEffect(() => {
    (async () => {
      try {
        const { me } = await graphql<MeResponse>(ME);
        if (me.role === "TEACHER") setUserId(me.id);
      } catch {
        console.error("Not authenticated");
      }
    })();
  }, []);

  // 2️⃣ Fetch teacher profile once we have userId
  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoadingProfile(true);
      try {
        const { getTeacherProfile } = await graphql<{
          getTeacherProfile: TeacherProfile | null;
        }>(GET_TEACHER_PROFILE, { id: userId });
        setTeacher(getTeacherProfile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [userId]);

  // 3️⃣ Handle creating a new course
  const handleCreate = async () => {
    if (!teacher) return;
    setCreating(true);
    try {
      await graphql(CREATE_COURSE, {
        title: form.title,
        description: form.description,
        subjectId: teacher.subject.id,
        teacherId: teacher.id,
      });
      // re-fetch profile to update courses
      const { getTeacherProfile } = await graphql<{ getTeacherProfile: TeacherProfile }>(
        GET_TEACHER_PROFILE,
        { id: userId! }
      );
      setTeacher(getTeacherProfile);
      setForm({ title: "", description: "" });
      setDialogOpen(false);
    } catch (err) {
      console.error("Error creating course:", err);
    } finally {
      setCreating(false);
    }
  };

  if (loadingProfile) return <div className="p-6">Loading your profile…</div>;
  if (!teacher) return <div className="p-6 text-red-500">Teacher profile not found.</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header + Add Course */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Course</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Course Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <Input
                placeholder="Course Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <Button
                className="w-full"
                onClick={handleCreate}
                disabled={creating || !form.title}
              >
                {creating ? "Creating…" : "Create Course"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subject */}
      <div>
        <span className="text-lg font-medium text-muted-foreground">Subject:</span>{" "}
        <span className="text-lg">{teacher.subject.name}</span>
      </div>

      {/* Courses Table */}
      {teacher.courses.length === 0 ? (
        <p>No courses yet—create one above!</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacher.courses.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
