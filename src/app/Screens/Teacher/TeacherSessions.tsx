"use client";

import { useEffect, useState } from "react";
import { graphql } from "@/lib/graphql";
import {
  GET_TEACHER_PROFILE,
  GET_TEACHER_SESSIONS,
  ME,
} from "@/graphql/queries";
import { Calendar, momentLocalizer,View,ToolbarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SCHEDULE_SESSION } from "@/graphql/mutations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const localizer = momentLocalizer(moment);

type MeResponse = { me: { id: string; role: string; name: string } };

type TeacherProfile = {
  id: string;
  name: string;
  subject: { id: string; name: string };
  classes: { id: string; name: string }[];
  courses: {
    id: string;
    title: string;
  }[];
};

type Session = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isLive: boolean;
  link: string;
  course: {
    title: string;
    subject: {
      name: string;
    };
  };
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    isLive: boolean;
    course: string;
    subject: string;
    link: string;
  };
};

export default function TeacherSessionsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<View>('month');
  const [form, setForm] = useState({
    title: "",
    courseId: "",
    classId: "",
    startTime: "",
    endTime: "",
    link: "",
  });

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { me } = await graphql<MeResponse>(ME);
        if (me.role === "TEACHER") setUserId(me.id);
      } catch {
        toast.error("Not authenticated");
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  // Fetch teacher profile
  useEffect(() => {
    if (!userId) return;
    
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const { getTeacherProfile } = await graphql<{
          getTeacherProfile: TeacherProfile;
        }>(GET_TEACHER_PROFILE, { id: userId });
        setTeacher(getTeacherProfile);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load teacher profile");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // Fetch sessions
  useEffect(() => {
    if (!teacher?.id) return;
    
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const { getTeacherSessions } = await graphql<{
          getTeacherSessions: Session[];
        }>(GET_TEACHER_SESSIONS, { teacherId: teacher.id });
        setSessions(getTeacherSessions);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [teacher]);

  // Format events for calendar
  const events: CalendarEvent[] = sessions.map((session) => ({
    id: session.id,
    title: session.title,
    start: new Date(Number(session.startTime)),
    end: new Date(Number(session.endTime)),
    resource: {
      isLive: session.isLive,
      course: session.course.title,
      subject: session.course.subject.name,
      link: session.link,
    },
  }));

  // Handle event selection
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Handle calendar navigation
  const handleNavigate = (newDate: Date, view: string) => {
    console.log(`Navigated to ${view} view with date ${newDate}`);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!form.title || !form.courseId || !form.classId || !form.startTime || !form.endTime) {
      toast.error("Please fill all required fields");
      return;
    }
    if (new Date(form.startTime) >= new Date(form.endTime)) {
        toast.error("End time must be after start time");
        return;
    }

    try {
      await graphql(SCHEDULE_SESSION, {
        ...form,
        startTime: new Date(form.startTime),
        endTime: new Date(form.endTime),
      });
      
      toast.success("Session scheduled successfully");
      setShowModal(false);
      setForm({
        title: "",
        courseId: "",
        classId: "",
        startTime: "",
        endTime: "",
        link: "",
      });
      
      // Refresh sessions
      const { getTeacherSessions } = await graphql<{
        getTeacherSessions: Session[];
      }>(GET_TEACHER_SESSIONS, { teacherId: teacher?.id });
      setSessions(getTeacherSessions);
    } catch (err) {
      console.error(err);
      toast.error("Failed to schedule session");
    }
  };

const CustomToolbar = ({ label, onNavigate, onView }: ToolbarProps<CalendarEvent, object>) => (
  <div className="rbc-toolbar flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
    <div className="rbc-btn-group space-x-2">
      <Button variant="outline" size="sm" onClick={() => onNavigate('PREV')}>
        Back
      </Button>
      <Button variant="outline" size="sm" onClick={() => onNavigate('TODAY')}>
        Today
      </Button>
      <Button variant="outline" size="sm" onClick={() => onNavigate('NEXT')}>
        Next
      </Button>
    </div>
    <span className="text-lg font-medium">{label}</span>
    <div className="rbc-btn-group space-x-2">
      <Button variant="ghost" size="sm" onClick={() => onView('month')}>
        Month
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onView('week')}>
        Week
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onView('day')}>
        Day
      </Button>
    </div>
  </div>
);



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Teaching Schedule</h1>
          <Button onClick={() => setShowModal(true)}>Schedule New Session</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[600px] w-full" />
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                view={view}
                onView={(v) => setView(v)} 
                onSelectEvent={handleSelectEvent}
                onNavigate={handleNavigate}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.resource.isLive ? "#10B981" : "#3B82F6",
                    borderColor: event.resource.isLive ? "#059669" : "#2563EB",
                    color: "white",
                    borderRadius: "4px",
                    padding: "2px 5px",
                  },
                })}
                components={{
                  toolbar: CustomToolbar,
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Event Details Modal */}
        <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
              <DialogDescription>
                {selectedEvent?.resource.course} ({selectedEvent?.resource.subject})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label className="font-medium">Time:</Label>
                <p className="text-sm">
                  {selectedEvent?.start.toLocaleString([], {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - {' '}
                  {selectedEvent?.end.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="font-medium">Status:</Label>
                <p className="text-sm">
                  {selectedEvent?.resource.isLive ? (
                    <span className="text-green-600">Live Now</span>
                  ) : (
                    <span className="text-blue-600">Upcoming</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="font-medium">Meeting Link:</Label>
                {selectedEvent?.resource.link ? (
                  <a
                    href={selectedEvent.resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {selectedEvent.resource.link}
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">No link provided</p>
                )}
              </div>
            </div>
            <DialogFooter>
              {selectedEvent?.resource.isLive && (
                <Button asChild>
                  <a
                    href={selectedEvent.resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <span>Join Now</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowEventModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Session Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Schedule New Session</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title *</Label>
                <Input
                  id="title"
                  placeholder="Introduction to Algebra"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course *</Label>
                  <Select
                    onValueChange={(value) => setForm({ ...form, courseId: value })}
                    value={form.courseId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacher?.courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select
                    onValueChange={(value) => setForm({ ...form, classId: value })}
                    value={form.classId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacher?.classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Meeting Link</Label>
                <Input
                  id="link"
                  placeholder="https://meet.google.com/abc-xyz"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Schedule Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}