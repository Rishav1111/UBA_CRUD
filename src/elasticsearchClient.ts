import { Client } from '@elastic/elasticsearch';

// Create the Elasticsearch client instance
export const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'z63Aj2t*OPDw9DQ1e_=i',
    },
    tls: {
        rejectUnauthorized: false, // Bypass self-signed certificate issues
    },
});

// Check the connection
async function checkElasticsearchConnection() {
    try {
        await client.ping();
        console.log('Elasticsearch connection successful');
    } catch (error: any) {
        if (error.meta && error.meta.body) {
            console.error('Elasticsearch connection error:', error.meta.body);
        } else {
            console.error('Elasticsearch connection error:', error);
        }
    }
}

checkElasticsearchConnection();

// async function createIndex() {
//   try {
//     await client.indices.create({
//       index: 'users_list',
//       body: {
//         mappings: {
//           properties: {
//             id: { type: 'integer' },

//             fullname: { type: 'text' },
//             DOB: { type: 'date', format: 'yyyy-MM-dd' },
//             phoneNumber: { type: 'text' },
//             email: { type: 'text' },
//           },
//         },
//       },
//     });

//     console.log('Index created successfully');
//   } catch (error: any) {
//     if (error.meta && error.meta.body) {
//       console.error('Error creating index:', error.meta.body);
//     } else {
//       console.error('Error creating index:', error);
//     }
//   }
// }

// createIndex();
