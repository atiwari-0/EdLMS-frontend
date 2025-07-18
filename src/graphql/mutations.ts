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


export const CREATE_SUBJECT = `
  mutation CreateSubject($input: CreateSubjectInput!) {
    createSubject(input: $input) {
      id
      name
    }
  }
`;

export const CREATE_CLASSROOM = `
  mutation CreateClassRoom($input: CreateClassInput!) {
    createClassRoom(input: $input) {
      id
      name
    }
  }
`;
