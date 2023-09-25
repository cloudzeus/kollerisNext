import mongoose from 'mongoose';

const connectMongo = async () => mongoose.connect(process.env.MONGO_URI).then(() => console.log('Mongo Connected!'));
const closeMongo = async () => mongoose.connection.close().then(() => console.log('Mongo Disconnected!'));
export { closeMongo };
export default connectMongo;


