const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

const Database = require('./database')

const urls = [
  {id: '0', url: 'https://google.com', shortCode: '0'},
  {id: '1', url: 'https://googlde.com', shortCode: '1'},
  {id: '2', url: 'https://goode.com', shortCode: '2'},
]

const UrlType = new GraphQLObjectType({
  name: 'Url',
  fields: () => ({
    id: {type: GraphQLString},
    url: {type: GraphQLString},
    shortCode: {type: GraphQLString}
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    url: {
      type: UrlType,
      args: {
        shortCode: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        for (let url of urls) {
          if (url.shortCode === args.shortCode) {
            return url
          }
        }
      }
    },

    shortCode: {
      type: UrlType,
      args: {
        url: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        for (let url of urls) {
          if (url.url === args.url) {
            return url
          }
        }
      }
    },

  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
