import mongoose from 'mongoose';

const connectMongo = async () => mongoose.connect('mongodb+srv://giannischiout:chiout2509@cluster0.h15nurx.mongodb.net/kolleris');
export default connectMongo;


const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));