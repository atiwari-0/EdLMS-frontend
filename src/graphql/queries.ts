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
