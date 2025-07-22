export const LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      role
    }
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
