const axios = require('axios');

const API_URL = 'http://localhost:3005/code/execute';

const payload = {
    language: 'javascript',
    version: '18.15.0',
    code: `function sum(a, b) {
  return a + b;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(',').map(Number);
if (input.length >= 2) {
  console.log(sum(input[0], input[1]));
}`,
    stdin: '1, 2'
};

async function testExecute() {
    try {
        console.log('Sending request to:', API_URL);
        console.log('Payload:', JSON.stringify(payload, null, 2));
        const response = await axios.post(API_URL, payload);
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

testExecute();
