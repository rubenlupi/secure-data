import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import * as path from 'path';
import * as fs from 'fs';
import { resolvers } from './schema/resolvers';

export function setGraphql(app){
    const schemaCode = fs.readFileSync(path.join(__dirname, 'schema', 'schema.gql'), 'utf8')
    const schema = buildSchema(schemaCode)

    app.use('/secure-data', graphqlHTTP({
        schema,
        rootValue: resolvers,
        // hide internal errors
        customFormatErrorFn(err) {
            return {
                message: err.message,
            };
          }
    }));
}


