export const ME = `
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`;

export const GET_STUDENTS = `
  query GetStudents {
    students {
      id
      class {
        id
        name
      }
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_TEACHERS = `
  query GetTeachers {
    teachers {
      id
      subject {
        id
        name
      }
      user {
        id
        name
        email
      }
      classes{
        id
        name
      }
    }
  }
`;


export const GET_SUBJECTS = `
  query GetSubjects {
    subjects {
      id
      name
    }
  }
`;

export const GET_CLASSES = `
  query GetClasses {
    classes {
      id
      name
    }
  }
`;

export const GET_STUDENT_PROFILE = `
  query GetStudentProfile($id: ID!) {
    getStudentProfile(id: $id) {
      id
      user {
        id
        name
        email
        role
      }
      class {
        id
        name
      }
      attendances {
        id
        session {
          id
          title
        }
        status
      }
      payments {
        id
        amount
        dueDate
        status
        paidAt
      }
      doubts {
        id
        title
        content
        status
        createdAt
        subject {
          id
          name
        }
      }
    }
  }
`;

export const GET_STUDENT_SUBJECTS = `
  query GetStudentSubjects($studentId: ID!) {
    getStudentSubjects(studentId: $studentId) {
      id
      name
    }
  }
`;


export const GET_STUDENT_COURSES_BY_SUBJECT = `
  query GetStudentCoursesBySubject($studentId: ID!, $subjectId: ID!) {
    getStudentCoursesBySubject(studentId: $studentId, subjectId: $subjectId) {
      id
      title
      description
      subject {
        id
        name
      }
      teacher {
        id
        user {
          id
          name
        }
      }
      sessions {
        id
        title
        startTime
        endTime
      }
    }
  }
`;

export const GET_COURSE_NOTES = `
  query GetCourseNotes($courseId: ID!) {
    getCourseNotes(courseId: $courseId) {
      id
      title
      fileUrl
      uploadedAt
    }
  }
`;


export const GET_STUDENT_COURSE_SESSIONS = `
  query GetStudentCourseSessions($courseId: ID!) {
    getStudentCourseSessions(courseId: $courseId) {
      id
      title
      startTime
      endTime
      isLive
      link
      status
    }
  }
`;

export const GET_STUDENT_ATTENDANCE = `
  query GetStudentAttendance($studentId: ID!) {
    getStudentAttendance(studentId: $studentId) {
      id
      session {
        id
        title
      }
      status
    }
  }
`;

export const GET_STUDENT_PAYMENTS = `
  query GetStudentPayments($studentId: ID!) {
    getStudentPayments(studentId: $studentId) {
      id
      amount
      dueDate
      status
      paidAt
    }
  }
`;

export const GET_LIVE_SESSIONS = `
  query GetLiveSessions($studentId: ID!) {
    getLiveSessions(studentId: $studentId) {
      id
      title
      startTime
      endTime
      link
      status
      isLive
    }
  }
`;

export const GET_TEACHER_PROFILE = `
  query GetTeacherProfile($id: ID!) {
    getTeacherProfile(id: $id) {
      id
      user {
        id
        name
        email
      }
      subject {
        id
        name
      }
      classes {
        id
        name
      }
      courses {
        id
        title
        description
      }
    }
  }
`;

export const GET_TEACHER_COURSES = `
  query GetTeacherCourses($teacherId: ID!) {
    getTeacherCourses(teacherId: $teacherId) {
      id
      title
      description
      subject {
        id
        name
      }
    }
  }
`;

export const GET_TEACHER_DOUBTS = `
  query GetTeacherDoubts($teacherId: ID!) {
    getTeacherDoubts(teacherId: $teacherId) {
      id
      title
      content
      createdAt
      status
      subject {
        id
        name
      }
      student {
        id
        user {
          id
          name
        }
        class {
          id
          name
        }
      }
    }
  }
`;

export const GET_TEACHER_COURSE_NOTES = `
  query GetTeacherCourseNotes($courseId: ID!) {
    getTeacherCourseNotes(courseId: $courseId) {
      id
      title
      fileUrl
      uploadedAt
    }
  }
`;

export const GET_TEACHER_COURSE_SESSIONS = `
  query GetTeacherCourseSessions($courseId: ID!) {
    getTeacherCourseSessions(courseId: $courseId) {
      id
      title
      startTime
      endTime
      isLive
      link
      status
    }
  }
`;
export const GET_TEACHER_SESSIONS = `
query GetTeacherSessions($teacherId: ID!) {
  getTeacherSessions(teacherId: $teacherId) {
    id
    title
    startTime
    endTime
    isLive
    link
    course {
      title
      subject {
        name
      }
    }
  }
}
`;
