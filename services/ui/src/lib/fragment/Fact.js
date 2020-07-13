import gql from 'graphql-tag';

export default gql`
  fragment factFields on Fact {
    id
    environment {
        id
    }
    name
    value
  }
`;
