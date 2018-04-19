const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')
const validUrl = require('valid-url')
const database = require('./databaseInit')
const generateShortCode = require('./generateShortCode')

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
    shortcode: {type: GraphQLString},
    error: {type: GraphQLString}
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

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    url: {
      type: UrlType,
      args: {
        url: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: async (parentValue, args) => {
        const { url } = args
         if (!validUrl.isUri(url)) {
            return {
              error: 'Not a valid url'
            }
         } else {
           const shortcode = await generateShortCode()
           await database.save(url, shortcode)
           return { shortcode, url }
         }
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
