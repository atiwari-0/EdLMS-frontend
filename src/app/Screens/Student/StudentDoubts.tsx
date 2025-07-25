'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { graphql } from '@/lib/graphql';
import { ASK_DOUBT } from '@/graphql/mutations';
import { GET_STUDENT_DOUBTS,ME,GET_STUDENT_PROFILE,GET_STUDENT_SUBJECTS} from '@/graphql/queries';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";



type MeResponse = { me: { id: string; role: string; name: string } };

type Subject = { id: string; name: string };

type StudentProfile = {
  id: string;
  class: { id: string; name: string }[];
};

export default function StudentDoubtsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [doubts, setDoubts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [form, setForm] = useState({
    subjectId: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { me } = await graphql<MeResponse>(ME);
        if (me.role === "STUDENT") setUserId(me.id);
      } catch {
        toast.error("Not authenticated");
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  // Fetch student profile
  useEffect(() => {
    if (!userId) return;
    
    const fetchProfile = async () => {
      try {
        const { getStudentProfile } = await graphql<{
          getStudentProfile: StudentProfile;
        }>(GET_STUDENT_PROFILE, { id: userId });
        setStudent(getStudentProfile);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load student profile");
      }
    };
    fetchProfile();
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

  const handlePostDoubt = async () => {
    await graphql(ASK_DOUBT, {
      studentId : student?.id,
      subjectId: form.subjectId,
      title: form.title,
      content: form.content,
    });

    setForm({ subjectId: '', title: '', content: '' });
    setOpen(false);

    const { getStudentDoubts } = await graphql<{ getStudentDoubts: any[] }>(
    GET_STUDENT_DOUBTS,
    { studentId: student?.id }
    );
    setDoubts(getStudentDoubts);
  };

  const fetchDoubts = async (id: string) => {
    const { getStudentDoubts } = await graphql<{ getStudentDoubts: any[] }>(
    GET_STUDENT_DOUBTS,
    { studentId: student?.id }
    );
    setDoubts(getStudentDoubts);
    };

    useEffect(() => {
    if (student?.id) fetchDoubts(student.id);
    }, [student?.id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Doubts</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTitle>
            <DialogTrigger asChild>
            <Button>Add Doubt</Button>
          </DialogTrigger>
          </DialogTitle>
          <DialogContent>
            <div className="space-y-4">
              <div>
                <Label>Subject</Label>
                <select
                    className="w-full border rounded p-2"
                    value={form.subjectId}
                    onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                >
                    <option value="">Select subject</option>
                    {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                        {subject.name}
                    </option>
                    ))}
                </select>
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>
              <Button onClick={handlePostDoubt}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doubts.map((doubt) => (
          <Card key={doubt.id}>
            <CardContent className="p-4 space-y-1">
              <p className="text-lg font-semibold">{doubt.title}</p>
              <p className="text-sm text-muted-foreground">{doubt.content}</p>
              <p className="text-xs text-gray-500">
                Subject: {doubt.subject.name} • Status: {doubt.status}
              </p>
              <p className="text-xs text-gray-400">{new Date(Number(doubt.createdAt)).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}