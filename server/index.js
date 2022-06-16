const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");
const resolvers = require("./src/resolvers");
const typeDefs = require("./src/schema");
require("dotenv").config();

const { JWT_SECRET, PORT } = process.env;
const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, JWT_SECRET);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.get("Authorization") || "";
    return { user: getUser(token.replace("Bearer", "")) };
  },
  introspection: true,
  playground: true,
});
server.listen({ port: PORT || 9895 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
