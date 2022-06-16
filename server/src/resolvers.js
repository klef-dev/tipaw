const { prisma } = require("./database");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const resolvers = {
  Query: {
    async me(_, args, { user }) {
      if (!user) throw new Error("You are not authenticated");
      return prisma.user.findFirst({ where: { id: user.id } });
    },
    async user(root, { id }, { user }) {
      try {
        if (!user) throw new Error("You are not authenticated!");
        return prisma.user.findFirst({ where: { id } });
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async users(root, args, { user }) {
      try {
        if (!user) throw new Error("You are not authenticated!");
        return prisma.user.findMany();
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    register: async (parent, { firstName, lastName, email, password }) => {
      try {
        const user = await prisma.user.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: await bcrypt.hash(password, 10),
          },
        });
        return {
          token: jsonwebtoken.sign({ userId: user.id }, process.env.JWT_SECRET),
          user,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    login: async (parent, { email, password }) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });
        if (!user) {
          throw new Error("No user with this email");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Incorrect email or password");
        }
        return {
          token: jsonwebtoken.sign({ userId: user.id }, process.env.JWT_SECRET),
          user,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
