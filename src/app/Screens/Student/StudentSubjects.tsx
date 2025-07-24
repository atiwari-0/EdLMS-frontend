"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { graphql } from "@/lib/graphql";
import {
  ME,
  GET_STUDENT_PROFILE,
  GET_STUDENT_SUBJECTS,
  GET_STUDENT_COURSES_BY_SUBJECT,
  GET_COURSE_NOTES,
} from "@/graphql/queries";

type MeResponse = {
  me: { id: string; role: string; name: string };
};

type Subject = {
  id: string;
  name: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
};

type Note = {
  id: string;
  title: string;
  fileUrl: string;
};

type StudentProfile = {
  id: string;
};

export default function StudentSubjectsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [coursesMap, setCoursesMap] = useState<Record<string, Course[]>>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { me } = await graphql<MeResponse>(ME);
        if (me.role === "STUDENT") setUserId(me.id);
      } catch {
        console.error("Not authenticated.");
      }
    })();
  }, []);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { getStudentProfile } = await graphql<{ getStudentProfile: StudentProfile }>(
        GET_STUDENT_PROFILE,
        { id: userId }
      );
      setStudent(getStudentProfile);
    })();
  }, [userId]);

  useEffect(() => {
    if (!student?.id) return;
    (async () => {
      const { getStudentSubjects } = await graphql<{ getStudentSubjects: Subject[] }>(
        GET_STUDENT_SUBJECTS,
        { studentId: student.id }
      );
      setSubjects(getStudentSubjects);
    })();
  }, [student]);

  const toggleSubject = async (subjectId: string) => {
    if (expandedSubjectId === subjectId) {
      setExpandedSubjectId(null);
      return;
    }

    setExpandedSubjectId(subjectId);

    if (!coursesMap[subjectId] && student) {
      const { getStudentCoursesBySubject } = await graphql<{
        getStudentCoursesBySubject: Course[];
      }>(GET_STUDENT_COURSES_BY_SUBJECT, {
        studentId: student.id,
        subjectId,
      });

      setCoursesMap((prev) => ({
        ...prev,
        [subjectId]: getStudentCoursesBySubject,
      }));
    }
  };

  const openCourseNotes = async (course: Course) => {
    setSelectedCourse(course);
    setShowDialog(true);
    setLoadingNotes(true);
    try {
      const { getCourseNotes } = await graphql<{ getCourseNotes: Note[] }>(
        GET_COURSE_NOTES,
        { courseId: course.id }
      );
      setNotes(getCourseNotes);
    } catch (err) {
      console.error("Failed to fetch course notes:", err);
    } finally {
      setLoadingNotes(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Subjects</h2>

      {subjects.map((subject) => (
        <div key={subject.id} className="border rounded-lg p-4">
          <div
            onClick={() => toggleSubject(subject.id)}
            className="cursor-pointer font-semibold text-lg flex justify-between"
          >
            {subject.name}
            <span>{expandedSubjectId === subject.id ? "▲" : "▼"}</span>
          </div>

          {expandedSubjectId === subject.id && (
            <div className="mt-4 space-y-2">
              {(coursesMap[subject.id] || []).map((course) => (
                <div
                  key={course.id}
                  className="bg-muted p-3 rounded cursor-pointer hover:bg-accent"
                  onClick={() => openCourseNotes(course)}
                >
                  <h4 className="font-medium">{course.title}</h4>
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                </div>
              ))}
              {coursesMap[subject.id]?.length === 0 && (
                <p className="text-sm text-muted-foreground">No courses in this subject.</p>
              )}
            </div>
          )}
        </div>
      ))}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-muted-foreground">{selectedCourse?.description}</p>

            <h3 className="font-semibold mt-6">Notes</h3>
            {loadingNotes ? (
              <p>Loading notes…</p>
            ) : notes.length === 0 ? (
              <p>No notes available for this course.</p>
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
