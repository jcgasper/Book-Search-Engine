const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    _id: ID
    authors: [String]!
    description: String!
    bookId: ID!
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  input NewBook {
    authors: [String]!
    description: String!
    bookId: ID!
    image: String
    link: String
    title: String!
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: NewBook!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
