import { connect } from "amqplib";

const queue = "concurrent-queue";
const connection = await connect("amqp://abcprintf:Password@123@localhost");
const channel = await connection.createChannel();
await channel.assertQueue(queue, { durable: true });

for(let i = 0; i < 20; i++) {
    const message = "Hello World! : " + i;
    channel.sendToQueue(queue, Buffer.from(message), { persistent: false });
}

await channel.close();
await connection.close();