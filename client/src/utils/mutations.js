import { gql } from "@apollo/client";
// Mutation to add a property
export const ADD_PROPERTY = gql`
  mutation AddProperty($propertyDetails: propertyInput) {
    addProperty(propertyDetails: $propertyDetails) {
      _id
      address
      agent {
        username
      }
    }
  }
`;
// Mutation to update a property
export const UPDATE_PROPERTY = gql`
  mutation UpdateProperty($propertyId: ID!, $propertyDetails: propertyInput) {
    updateProperty(propertyId: $propertyId, propertyDetails: $propertyDetails) {
      _id
      address
    }
  }
`;
// Mutation to add a new complaint
export const ADD_COMPLAINT = gql`
  mutation AddComplaint($complaint: String!, $picUrl: [String]) {
    addComplaint(complaint: $complaint, picUrl: $picUrl) {
      _id
    }
  }
`;
//Mutation to add a new user
export const ADD_USER = gql`
  mutation AddUser(
    $username: String!
    $password: String!
    $email: String!
    $role: String!
  ) {
    addUser(
      username: $username
      password: $password
      email: $email
      role: $role
    ) {
      token
      user {
        _id
        role
      }
    }
  }
`;

// Mutation for user login
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        role
      }
    }
  }
`;

// Mutation to update a complaint
export const UPDATE_COMPLAINT = gql`
  mutation UpdateComplaint(
    $quotes: [quoteInput]
    $status: String
    $complaintId: String!
    $complaint: String!
    $picUrl: [String]
  ) {
    updateComplaint(
      quotes: $quotes
      status: $status
      complaintId: $complaintId
      complaint: $complaint
      picUrl: $picUrl
    ) {
      complaint
      quotes {
        address
        businessName
        quote
      }
    }
  }
`;

//mutation to add approved quote
export const ADD_APPROVED_QUOTE = gql`
  mutation AddApprovedQuote($approvedQuote: String!, $complaintId: String!) {
    addApprovedQuote(approvedQuote: $approvedQuote, complaintId: $complaintId) {
      _id
    }
  }
`;
// Mutation to get signed url and object url
export const S3Sign = gql`
  mutation S3Sign($filename: String!, $filetype: String!) {
    s3Sign(filename: $filename, filetype: $filetype) {
      url
      signedRequest
    }
  }
`;
