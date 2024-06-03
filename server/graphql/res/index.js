import userResolver from './user.js'
import videoResolver from './videos.js'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

export default{
    Upload: GraphQLUpload,
    Query:{
        ...userResolver.Query,
        ...videoResolver.Query
    },
    Mutation:{
        ...userResolver.Mutation,
        ...videoResolver.Mutation
    }
}