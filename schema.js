const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')
const database = require('./databaseInit')

const urls = [
  {id: '0', url: 'https://google.com', shortcode: '0'},
  {id: '1', url: 'https://googlde.com', shortcode: '1'},
  {id: '2', url: 'https://goode.com', shortcode: '2'},
]

const UrlType = new GraphQLObjectType({
  name: 'Url',
  fields: () => ({
    id: {type: GraphQLString},
    url: {type: GraphQLString},
    shortcode: {type: GraphQLString}
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    url: {
      type: UrlType,
      args: {
        shortcode: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return database.findURLbyShortCode(args.shortcode)
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
