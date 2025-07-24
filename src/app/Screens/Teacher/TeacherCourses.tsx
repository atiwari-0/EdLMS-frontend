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
import {
  ME,
  GET_TEACHER_PROFILE,
  GET_TEACHER_COURSE_NOTES,
} from "@/graphql/queries";
import { CREATE_COURSE, UPLOAD_NOTE } from "@/graphql/mutations";

type MeResponse = { me: { id: string; role: string; name: string } };
type Course = { id: string; title: string; description: string };
type Note = { id: string; title: string; fileUrl: string; uploadedAt: string };
type TeacherProfile = {
  id: string;
  subject: { id: string; name: string };
  courses: Course[];
};

export default function TeacherCoursesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: "", fileUrl: "" });
  const [showDialog, setShowDialog] = useState(false);

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

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoadingProfile(true);
      try {
        const { getTeacherProfile } = await graphql<{ getTeacherProfile: TeacherProfile }>(
          GET_TEACHER_PROFILE,
          { id: userId }
        );
        setTeacher(getTeacherProfile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [userId]);

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

  const openCourseDetails = async (course: Course) => {
    setSelectedCourse(course);
    setShowDialog(true);
    setNotesLoading(true);
    try {
      const res = await graphql<{ getTeacherCourseNotes: Note[] }>(
        GET_TEACHER_COURSE_NOTES,
        { courseId: course.id }
      );
      setNotes(res.getTeacherCourseNotes);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleNoteUpload = async () => {
    if (!selectedCourse) return;
    try {
      await graphql(UPLOAD_NOTE, {
        courseId: selectedCourse.id,
        title: noteForm.title,
        fileUrl: noteForm.fileUrl,
      });
      const res = await graphql<{ getTeacherCourseNotes: Note[] }>(
        GET_TEACHER_COURSE_NOTES,
        { courseId: selectedCourse.id }
      );
      setNotes(res.getTeacherCourseNotes);
      setNoteForm({ title: "", fileUrl: "" });
    } catch (err) {
      console.error("Note upload failed:", err);
    }
  };

  if (loadingProfile) return <div className="p-6">Loading your profile…</div>;
  if (!teacher) return <div className="p-6 text-red-500">Teacher profile not found.</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header + Create Course */}
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

      {/* Course List */}
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
              <TableRow key={c.id} onClick={() => openCourseDetails(c)} className="cursor-pointer">
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Course Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-muted-foreground">{selectedCourse?.description}</p>

            <h3 className="font-semibold mt-4">Upload Note</h3>
            <div className="space-y-2">
              <Input
                placeholder="Note Title"
                value={noteForm.title}
                onChange={(e) => setNoteForm((f) => ({ ...f, title: e.target.value }))}
              />
              <Input
                placeholder="File URL"
                value={noteForm.fileUrl}
                onChange={(e) => setNoteForm((f) => ({ ...f, fileUrl: e.target.value }))}
              />
              <Button
                onClick={handleNoteUpload}
                disabled={!noteForm.title || !noteForm.fileUrl}
              >
                Upload
              </Button>
            </div>

            <h3 className="font-semibold mt-6">All Notes</h3>
            {notesLoading ? (
              <p>Loading notes…</p>
            ) : notes.length === 0 ? (
              <p>No notes yet.</p>
            ) : (
              <ul className="space-y-1">
                {notes.map((note) => (
                  <li key={note.id} className="text-sm">
                    📄{" "}
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {note.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
