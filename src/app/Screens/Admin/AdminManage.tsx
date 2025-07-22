import EntitySection from "@/components/Admin/EntitySection";
import {
  CREATE_STUDENT,
  UPDATE_STUDENT,
  DELETE_STUDENT,
  CREATE_TEACHER,
  UPDATE_TEACHER,
  DELETE_TEACHER,
  CREATE_SUBJECT,
  UPDATE_SUBJECT,
  DELETE_SUBJECT,
  CREATE_CLASSROOM,
  UPDATE_CLASSROOM,
  DELETE_CLASSROOM
} from '@/graphql/mutations';
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
        updateMutation={UPDATE_STUDENT}
        deleteMutation={DELETE_STUDENT}
        fields={["name","classId"]}
      />

      <EntitySection
        title="Teachers"
        fetchQuery={GET_TEACHERS}
        createMutation={CREATE_TEACHER}
        updateMutation={UPDATE_TEACHER}
        deleteMutation={DELETE_TEACHER}
        fields={["name","subjectId", "classIds"]}
      />

      <EntitySection
        title="Classes"
        fetchQuery={GET_CLASSES}
        createMutation={CREATE_CLASSROOM}
        updateMutation={UPDATE_CLASSROOM}
        deleteMutation={DELETE_CLASSROOM}
        fields={["name"]}
      />

      <EntitySection
        title="Subjects"
        fetchQuery={GET_SUBJECTS}
        createMutation={CREATE_SUBJECT}
        updateMutation={UPDATE_SUBJECT}
        deleteMutation={DELETE_SUBJECT}
        fields={["name"]}
      />
    </div>
  );
}