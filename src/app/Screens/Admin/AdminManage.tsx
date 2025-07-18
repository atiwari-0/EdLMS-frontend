import EntitySection from "@/components/Admin/EntitySection";
import {
  CREATE_STUDENT, CREATE_TEACHER, CREATE_CLASSROOM, CREATE_SUBJECT,
} from "@/graphql/mutations";
import {
    GET_CLASSES, GET_STUDENTS, GET_SUBJECTS, GET_TEACHERS,
} from '@/graphql/queries';
export default function ManagePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <EntitySection
        title="Students"
        fetchQuery={GET_STUDENTS}
        createMutation={CREATE_STUDENT}
        fields={["name","classId"]}
      />

      <EntitySection
        title="Teachers"
        fetchQuery={GET_TEACHERS}
        createMutation={CREATE_TEACHER}
        fields={["name","subjectId", "classIds"]}
      />

      <EntitySection
        title="Classes"
        fetchQuery={GET_CLASSES}
        createMutation={CREATE_CLASSROOM}
        fields={["name"]}
      />

      <EntitySection
        title="Subjects"
        fetchQuery={GET_SUBJECTS}
        createMutation={CREATE_SUBJECT}
        fields={["name"]}
      />
    </div>
  );
}