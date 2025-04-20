import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import { DateTimeResolver } from 'graphql-scalars'

export const ExampleType = new GraphQLObjectType({
    name: 'Example',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: DateTimeResolver },
    }),
});