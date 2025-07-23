export const LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      role
    }
  }
`;
export const LOGOUT = `
  mutation Logout {
    logout
  }
`;

export const CREATE_STUDENT = `
  mutation CreateStudent($input: CreateStudentInput!) {
    createStudent(input: $input) {
      id
      user {
        name
        email
      }
      class{
      name
      }
    }
  }
`;

export const UPDATE_STUDENT = `
  mutation UpdateStudent($input: UpdateStudentInput!) {
    updateStudent(input: $input) {
      id
      user {
        name
      }
      class {
        id
        name
      }
    }
  }
`;

export const DELETE_STUDENT = `
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;


export const CREATE_TEACHER = `
  mutation CreateTeacher($input: CreateTeacherInput!) {
    createTeacher(input: $input) {
      id
      user {
        name
        email
      }
      subject{
      name
      }
      classes{
      name
      }
    }
  }
`;

export const UPDATE_TEACHER = `
  mutation UpdateTeacher($input: UpdateTeacherInput!) {
    updateTeacher(input: $input) {
      id
      user {
        name
      }
      subject {
        id
        name
      }
      classes {
        id
        name
      }
    }
  }
`;


export const DELETE_TEACHER = `
  mutation DeleteTeacher($id: ID!) {
    deleteTeacher(id: $id)
  }
`;


export const CREATE_SUBJECT = `
  mutation CreateSubject($input: CreateSubjectInput!) {
    createSubject(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_SUBJECT = `
  mutation UpdateSubject($input: UpdateSubjectInput!) {
    updateSubject(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_SUBJECT = `
  mutation DeleteSubject($id: ID!) {
    deleteSubject(id: $id)
  }
`;

export const CREATE_CLASSROOM = `
  mutation CreateClassRoom($input: CreateClassInput!) {
    createClassRoom(input: $input) {
      id
      name
    }
  }
`

export const UPDATE_CLASSROOM = `
  mutation UpdateClassRoom($input: UpdateClassInput!) {
    updateClassRoom(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_CLASSROOM = `
  mutation DeleteClassRoom($id: ID!) {
    deleteClassRoom(id: $id)
  }
`; 

export const ASK_DOUBT = `
  mutation AskDoubt($studentId: ID!, $subjectId: ID!, $title: String!, $content: String!) {
    askDoubt(studentId: $studentId, subjectId: $subjectId, title: $title, content: $content) {
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
`;

export const PAY_FOR_PAYMENT = `
  mutation PayForPayment($paymentId: ID!) {
    payForPayment(paymentId: $paymentId) {
      id
      amount
      status
      paidAt
    }
  }
`;

export const CREATE_COURSE = `
  mutation CreateCourse($title: String!, $description: String!, $subjectId: ID!, $teacherId: ID!) {
    createCourse(title: $title, description: $description, subjectId: $subjectId, teacherId: $teacherId) {
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

export const UPLOAD_NOTE = `
  mutation UploadNote($courseId: ID!, $title: String!, $fileUrl: String!) {
    uploadNote(courseId: $courseId, title: $title, fileUrl: $fileUrl) {
      id
      title
      fileUrl
      uploadedAt
    }
  }
`;

export const SCHEDULE_SESSION = `
  mutation ScheduleSession($courseId: ID!, $classId: ID!, $title: String!, $startTime: String!, $endTime: String!, $link: String!) {
    scheduleSession(courseId: $courseId, classId: $classId, title: $title, startTime: $startTime, endTime: $endTime, link: $link) {
      id
      title
      startTime
      endTime
      link
      isLive
      status
    }
  }
`;

export const MARK_ATTENDANCE = `
  mutation MarkAttendance($sessionId: ID!, $studentId: ID!, $status: AttendanceStatus!) {
    markAttendance(sessionId: $sessionId, studentId: $studentId, status: $status) {
      id
      status
      session {
        id
        title
      }
    }
  }
`;

export const RESPOND_TO_DOUBT = `
  mutation RespondToDoubt($doubtId: ID!, $status: DoubtStatus!) {
    respondToDoubt(doubtId: $doubtId, status: $status) {
      id
      title
      content
      status
    }
  }
`;

