import gql from 'graphql-tag';
import ProblemFragment from 'lib/fragment/Problem';

export default gql`
  query getProblemById($openshiftProjectName: String!, $id: Int!) {
    environment: environmentByOpenshiftProjectName(
      openshiftProjectName: $openshiftProjectName
    ) {
      id
      name
      created
      updated
      deployType
      environmentType
      routes
      openshiftProjectName
      project {
        id
        name
        problemsUi
        factsUi
      }
      problem: problem(id: $id) {
        ...problemFields
      }
    }
  }
  ${ProblemFragment}
`;
