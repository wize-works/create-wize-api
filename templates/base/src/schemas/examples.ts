// graphql/examples.ts
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import { ExampleType } from '../types/example';
import { supabase } from '../lib/supabase';
import { DateTimeTypeDefinition } from 'graphql-scalars';
import { PubSub } from 'graphql-subscriptions';
import { AuthContext } from '../types/auth-context';
import { hasScope } from '../lib/auth';
import Sentry from '../lib/sentry';

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
        getExample: {
            type: ExampleType,
            args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
            resolve: async (_, args: any, context: AuthContext) => {
                return await Sentry.startSpan({
                    name: 'getExample',
                    op: 'graphql.query',
                }, async () => {
                    if (!context.scopes.includes('examples:read')) {
                        throw new Error('Unauthorized: missing examples:read scope');
                    }
                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenant_id', value: tenantId });

                    const { data, error } = await supabase
                        .schema('api')
                        .from('examples')
                        .select('*')
                        .eq('id', args.id)
                        .single()
                    if (error) throw new Error(error.message)
                    return data

                });
            },
        },
        listExamples: {
            type: new GraphQLList(ExampleType),
            resolve: async (_, args: any, context: AuthContext) => {
                return await Sentry.startSpan({
                    name: 'listExamples',
                    op: 'graphql.query',
                }, async () => {
                    if (!hasScope(context, 'examples:read')) {
                        throw new Error('Unauthorized: missing examples:read scope');
                    }

                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenant_id', value: tenantId });

                    const { data, error } = await supabase
                        .schema('api')
                        .from('examples')
                        .select('*')
                        .order('created_at', { ascending: false })

                    if (error) throw new Error(error.message)
                    return data
                });
            },
        },
    },
});

const pubsub = new PubSub();
const EXAMPLE_ADDED = 'EXAMPLE_ADDED';
const EXAMPLE_UPDATED = 'EXAMPLE_UPDATED';
const EXAMPLE_DELETED = 'EXAMPLE_DELETED';

const Subscription = new GraphQLObjectType({
    name: 'Subscription',
    fields: {
        exampleAdded: {
            type: ExampleType,
            subscribe: () => pubsub.asyncIterableIterator([EXAMPLE_ADDED]),
        },
        exampleUpdated: {
            type: ExampleType,
            subscribe: () => pubsub.asyncIterableIterator([EXAMPLE_UPDATED]),
        },
        exampleDeleted: {
            type: ExampleType,
            subscribe: () => pubsub.asyncIterableIterator([EXAMPLE_DELETED]),
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createExample: {
            type: ExampleType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (_, args: any, context: AuthContext) => {
                return await Sentry.startSpan({
                    name: 'createExample',
                    op: 'graphql.mutation',
                }, async () => {
                    if (!context.scopes.includes('examples:write')) {
                        throw new Error('Unauthorized: missing examples:write scope');
                    }

                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenant_id', value: tenantId });


                    const { data, error } = await supabase
                        .schema('api')
                        .from('examples')
                        .insert([{
                            title: args.title,
                            tenant_id: tenantId,
                            created_at: new Date().toISOString()
                        }])
                        .select()
                        .single();

                    if (error) throw new Error(error.message);
                    pubsub.publish(EXAMPLE_ADDED, { exampleAdded: data });
                    return data;
                });
            },
        },
        updateExample: {
            type: ExampleType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                title: { type: GraphQLString },
            },
            resolve: async (_, args: any, context: AuthContext) => {
                return await Sentry.startSpan({
                    name: 'updateExample',
                    op: 'graphql.mutation',
                }, async () => {
                    if (!context.scopes.includes('examples:write')) {
                        throw new Error('Unauthorized: missing examples:write scope');
                    }
                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenant_id', value: tenantId });

                    const { data, error } = await supabase
                        .schema('api')
                        .from('examples')
                        .update({ title: args.title })
                        .eq('id', args.id)
                        .select()
                        .single();

                    if (error) throw new Error(error.message);
                    pubsub.publish(EXAMPLE_UPDATED, { exampleUpdated: data });
                    return data;
                });
            },
        },
        deleteExample: {
            type: ExampleType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: async (_, args: any, context: AuthContext) => {
                return await Sentry.startSpan({
                    name: 'deleteExample',
                    op: 'graphql.mutation',
                }, async () => {
                    if (!context.scopes.includes('examples:write')) {
                        throw new Error('Unauthorized: missing examples:write scope');
                    }
                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenant_id', value: tenantId });

                    const { data, error } = await supabase
                        .schema('api')
                        .from('examples')
                        .delete()
                        .eq('id', args.id)
                        .select()
                        .single();

                    if (error) throw new Error(error.message);
                    pubsub.publish(EXAMPLE_DELETED, { exampleDeleted: data });
                    return data;
                });
            },
        },
    },
});

export const exampleSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
    subscription: Subscription,
});