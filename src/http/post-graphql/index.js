const { graphql } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')

var typeDefs = `
  type Query {
    hello: String
  }
  type Mutation {
    hello: String
  }
`

let helloMessage = 'World!'

const resolvers = {
  Query: {
    hello: () => helloMessage
  },
  Mutation: {
    hello: (_, helloData) => {
      helloMessage = helloData.message
      return helloMessage
    }
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

exports.handler = async function http (req) {
  const { query, variables, operationName } = JSON.parse(Buffer.from(req.body, 'base64'))
  const body = JSON.stringify(await graphql(schema, query, {}, { request: req }, variables, operationName))
  return {
    headers: { 'content-type': 'application/json' },
    body
  }
}
