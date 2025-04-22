import { GraphQLModel } from '@wizeworks/graphql-factory';
const ExampleType: GraphQLModel = {
    name: 'Example',
    fields:{
        id: { type: 'int', required: true, defaultValue: 0 },
        title: { type: 'string', required: true },
        createdAt: { type: 'datetime', required: true, defaultValue: 'now()' },
        updatedAt: { type: 'datetime', required: true, defaultValue: 'now()' },
        createdBy: { type: 'string', required: false },
        updatedBy: { type: 'string', required: false },
    }
};

export default ExampleType;