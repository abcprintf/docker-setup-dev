const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

const run = async () => {

    client.index({
        index: 'my-index',
        body: {
            title: 'Test'
        }
    });
};

run().catch(console.log);