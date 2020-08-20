import gql from 'graphql-tag';
import ProblemsFragment from 'lib/fragment/Problem';

export default gql`
  query getAllProjectsProblemsQuery($severity: [ProblemSeverityRating], $source: [String], $envType: EnvType) {
    projectsProblems: allProjects {
      id
      name
      openshiftProjectName
      environments(type: $envType) {
        id
        name
        openshiftProjectName
        project {
            name
        }
        problems(severity: $severity, source: $source) {
          ...problemFields
        }
      }
    }
  }
  ${ProblemsFragment}
`;