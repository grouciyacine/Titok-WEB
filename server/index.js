import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import express from 'express'
import typeDef from './graphql/typedef.js'
import resolvers from './graphql/res/index.js'
import connect from './connect.js'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import cors from 'cors'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
dotenv.config()
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());
app.use('/videos', express.static(join(__dirname, 'graphql', 'res', 'public', 'videos')));
app.use('/images', express.static(join(__dirname, 'graphql', 'res', 'public', 'images')));
const server = new ApolloServer({
    typeDefs: typeDef,
    resolvers: resolvers,
    context: ({ req }) => ({ req })
})
await server.start();
app.use(graphqlUploadExpress());
server.applyMiddleware({ app });
app.use((err, req, res, next) => {
    if (err) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    }
});

const start = async () => {
    try {
        await connect(process.env.DATABASE)
        return app.listen({ port: 5000 }, () =>
            console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
        );
    } catch (err) {
        console.log(err)
    }
}
start()
