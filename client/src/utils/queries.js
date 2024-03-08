import { gql } from "@apollo/client";
export const QUERY_USERS = gql`
  query Users {
    users {
      _id
      email
      role
      username
    }
  }
`;
export const QUERY_PROPERTY = gql`
  query Properties {
    properties {
      address
      agent {
        username
      }
      owner {
        username
      }
      tenant {
        username
      }
    }
  }
`;
export const QUERY_PROPERTIES_BY_USER = gql`
  query PropertiesByUser($role: String!) {
    propertiesByUser(role: $role) {
      _id
      address
      owner {
        _id
        username
      }
      agent {
        _id
        username
      }
      tenant {
        _id
        username
      }
    }
  }
`;

export const QUERY_COMPLAINTS_RAISED = gql`
  query ComplaintsRaised {
    complaintsRaised {
      _id
      date
      complaint
      property {
        _id
        address
      }
      status
      quotes {
        address
        businessName
        quote
      }
      approvedQuote
      picUrl
    }
  }
`;
