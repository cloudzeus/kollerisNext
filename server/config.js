import mongoose from 'mongoose';

const connectMongo = async () => mongoose.connect('mongodb+srv://giannischiout:chiout2509@cluster0.h15nurx.mongodb.net/kolleris');
export default connectMongo;


