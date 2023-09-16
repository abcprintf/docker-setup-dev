const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

const run = async () => {

    client.index({
        index: 'my-index',
        body: {
            title: 'Test'
        }
    });

    const body = await client.search({
        index: 'my-index',
        body: {
            query: {
                match: { title: 'Test' }
            }
        }
    });

    console.log(body.hits.hits);
};

run().catch(console.log);