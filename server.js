import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'

const users = [
  {
    id: 1,
    name: 'Brian',
    age: '21',
    gender: 'M'
  },
  {
    id: 2,
    name: 'Kim',
    age: '22',
    gender: 'M'
  },
  {
    id: 3,
    name: 'Joseph',
    age: '23',
    gender: 'M'
  },
  {
    id: 4,
    name: 'Faith',
    age: '23',
    gender: 'F'
  },
  {
    id: 5,
    name: 'Joy',
    age: '25',
    gender: 'F'
  }
]

const getUser = (args) => {
  const userID = args.id
  return users.filter(user =>
    user.id === userID
  )[0]
}

const retrieveUsers = (args) => {
  if (args.gender) {
    const gender = args.gender
    return users.filter(user => user.gender === gender)
  } else {
    return users
  }
}

const updateUser = ({id, name, age}) => {
  users.map(user => {
    if (user.id === id) {
      user.name = name
      user.age = age
      return user
    }
  })
  return users.filter(user => user.id === id)[0]
}

// root resolver

const root = {
  user: getUser,
  users: retrieveUsers,
  updateUser: updateUser
}

// Initialize a GraphQL schema
const schema = buildSchema(
  `
  type Query {
    user(id: Int!): Person
    users(gender: String): [Person]
  },
  type Mutation {
    updateUser(id: Int!, name: String!, age: String): Person
  },
  type Person {
    id: Int
    name: String
    age: Int
    gender: String
  }
  `
)

// create an express server and a GraphQl endpoint
const app = express()

app.use('/graphql', graphqlHTTP({
  schema: schema, // Must be provided
  rootValue: root,
  graphiql: true // Enable GraphiQL when server endpoint is accessed in browser
}))

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'))
