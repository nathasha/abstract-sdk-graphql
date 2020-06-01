  
const { ApolloServer, gql } = require('apollo-server');

const path = require("path");
const Abstract = require("abstract-sdk");
const accessToken = process.env.ABSTRACT_SDK_TOKEN;


// const client = new Abstract.Client({
//   accessToken: process.env.ABSTRACT_SDK_TOKEN,
//   transportMode: ["api"]
// });


const typeDefs = gql`
  type User {
    id: ID!
    avatarUrl: String
    createdAt: String
    deletedAt: String
    name: String
    primaryEmailId: String
    username: String
  }


  type Project {
    id: ID!
    about:  String
    archivedAt: String
    assetAutoGeneration: String
    description: String
    color: String
    createdAt: String!
    createdByUser: User
    firstPushedAt: String!
    isNew: Boolean
    name: String
    organizationId: String!
    pushedAt: String
    repoCreatedAt: String!
    sizeInBytes: Int
    updatedAt: String!
    visibility: String
  }
  type Query {
    projects: [Project]
    users: [User]
  }
`;

const resolvers = {
  Query: {
    projects: async (_source, { id }, { dataSources }) => {
      // List all projects accessible through the current authentication
      // return client.projects.list();
      return dataSources.abstract.projects.list()
    },
    users: async (_source, { id }, { dataSources }) => {
      // TODO: id no workie
      return dataSources.abstract.users.list({
        organizationId: id
      });
    },
  }
};

const server = new ApolloServer({
  typeDefs, 
  resolvers,
  dataSources: () => {
    return {
      abstract: new Abstract.Client({
        accessToken: process.env.ABSTRACT_SDK_TOKEN
      })
    };
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

