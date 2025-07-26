const vault = require('node-vault');

async function test() {
  const client = vault({
    apiVersion: 'v1',
    endpoint: 'http://localhost:8201',
    token: 'myroot'
  });

  try {
    console.log('Testing vault connection...');
    const status = await client.status();
    console.log('Status:', status.sealed);

    console.log('Testing write operation...');
    const result = await client.write('secret/data/test123', {
      data: { key: 'value', test: 'data' }
    });
    console.log('Write result:', result);

    console.log('Testing read operation...');
    const read = await client.read('secret/data/test123');
    console.log('Read result:', read.data.data);

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.statusCode);
      console.error('Body:', error.response.body);
    }
  }
}

test();
