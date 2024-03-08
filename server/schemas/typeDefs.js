const typeDefs = `
type Property{
   _id:ID
   address:String
   owner:User
   agent:User
   tenant:User
}
type Quote{
    businessName:String!
    address:String!
    quote:String!
    }

type Complaint{
    _id:ID
    complaint:String
    property:Property
    date:String
    status:String
    quotes:[Quote]
    approvedQuote:String
    picUrl:[String]
}
type User{
    _id:ID
    username:String
    email:String
    role:String
}
type Auth{
    token:ID
    user:User
}

input propertyInput{
address:String!
owner:ID!
agent:ID!
tenant:ID!
}
input quoteInput{
    businessName:String!
    address:String!
    quote:String!
    }
type S3Payload{
    signedRequest:String!
    url:String!
}

type Query{
users:[User]
properties:[Property]
propertiesByUser(role:String!):[Property]
propertiesByOwner(ownerId:ID!):[Property]
complaintsRaised:[Complaint]
complaintsOfPropertyByOwner(ownerId:ID!):[Complaint]
complaintsRaisedByTenant(tenantId:ID!):[Complaint]
}
type Mutation{
addProperty(propertyDetails:propertyInput):Property
addComplaint(complaint:String!,picUrl:[String]):Complaint
addUser(username:String!,password:String!,email:String!,role:String!):Auth
updateComplaint(quotes:[quoteInput],status:String,complaintId:String!,complaint:String,picUrl:[String]):Complaint
updateProperty(propertyDetails:propertyInput,propertyId:ID!):Property
addApprovedQuote(approvedQuote:String!,complaintId:String!):Complaint
login(email: String!, password: String!): Auth,
s3Sign(filename:String!,filetype:String!):S3Payload
}`;
module.exports = typeDefs;
