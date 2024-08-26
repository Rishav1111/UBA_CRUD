import { client } from '../elasticsearchClient';
import { User } from '../entity/User';

export const indexUsersToElasticsearch = async (users: User[]) => {
    const bulkOperations = users.flatMap((user) => [
        {
            index: { _index: 'users_list', _id: user.id.toString() },
        },
        {
            id: user.id,
            fullname: user.fullname,
            DOB: new Date(user.DOB).toISOString().slice(0, 10),
            phoneNumber: user.phoneNumber,
            email: user.email,
        },
    ]);

    try {
        const response = await client.bulk({
            refresh: true,
            body: bulkOperations,
        });

        // Access body correctly
        const { body }: any = response;
        if (body.errors) {
            body.items.forEach((item: any) => {
                if (item.index && item.index.error) {
                    console.error(
                        `Error for document ID ${item.index._id}:`,
                        item.index.error
                    );
                }
            });
        } else {
            console.log('Users indexed successfully in Elasticsearch!');
        }
    } catch (error: any) {
        // Check the complete error object
        console.error(
            'Error during bulk indexing:',
            error.meta ? error.meta.body : error
        );
    }
};
