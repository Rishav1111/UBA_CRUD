export const typeDefs = `#graphql
    type User {
        id: ID!
        fullname: String!
        age: Int!
        phoneNumber: String!
        email: String!
        password: String!
    }
    
    type Query {
     users: [User]
     user(id: ID!) : User
     userSort(sortField: String, sortOrder:String,offset: Int, limit: Int ): [User]
   }
   type Mutation {
    addUser(user : UserInput!): [User]
    updateUser(id: ID!, edits: EditUserInput!): User
    deleteUser(id: ID!): [User]
   }

   input UserInput {
    fullname: String!
    age: Int!
    phoneNumber: String!
    email: String!
    password: String!
   }
   input EditUserInput {
    fullname: String
    age: Int
    phoneNumber: String
    email: String
    password: String
   }
`;
