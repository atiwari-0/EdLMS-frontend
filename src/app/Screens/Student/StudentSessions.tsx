"use client";

import { useEffect, useState } from "react";
import { graphql } from "@/lib/graphql";
import {
  GET_STUDENT_PROFILE,
  GET_STUDENT_SESSIONS,
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
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const localizer = momentLocalizer(moment);

type MeResponse = { me: { id: string; role: string; name: string } };

type StudentProfile = {
  id: string;
  class: { id: string; name: string }[];
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

export default function StudentSessionsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<View>('month');


  // Fetch current user
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

  // Fetch sessions
  useEffect(() => {
    if (!student?.id) return;
    
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const { getStudentSessions } = await graphql<{
          getStudentSessions: Session[];
        }>(GET_STUDENT_SESSIONS, { studentId: student.id });
        setSessions(getStudentSessions);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [student]);

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
          <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
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
      </div>
    </div>
  );
}