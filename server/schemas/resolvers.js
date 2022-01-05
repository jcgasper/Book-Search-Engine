const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context, info) => {
      const { username } = context.user;
      return User.findOne({ username }).populate('books');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
      const username = context.user.username;
      return User.findOneAndUpdate(
        { username },
        { $addToSet: { savedBooks: book } },
        { new: true }
      );
    },

    removeBook: async (parent, { bookId }, context) => {
      const username = context.user.username;
      return User.findOneAndUpdate(
        { username },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
