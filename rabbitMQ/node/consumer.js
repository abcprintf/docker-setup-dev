import { connect } from "amqplib";

const queue = "concurrent-queue";
const connection = await connect("amqp://abcprintf:Password@123@localhost");

const channel = await connection.createChannel();
await channel.assertQueue(queue, { durable: true });

channel.prefetch(1);
channel.consume(queue, async (message) => {
    let processTime = Math.floor(Math.random() * 8) + 1; // 1 to 8 seconds
  console.log(`Received message: ${message.content.toString()}`);
  await sleep(processTime * 1000);
    console.log(`Processed message: ${message.content.toString()}`);
    channel.ack(message);
}, { noAck: false });

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}