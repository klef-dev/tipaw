const { gql } = require("apollo-server");

const typeDefs = gql`
  type AuthPayload {
    token: String
    user: User
  }

  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
    me: User
  }

  type Mutation {
    register(
      firstName: String
      lastName: String
      email: String
      password: String
    ): AuthPayload
    login(email: String, password: String): AuthPayload
  }
`;

module.exports = typeDefs;
