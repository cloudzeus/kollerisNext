import mongoose from 'mongoose';

const connectMongo = async () => mongoose.connect("mongodb://dgsoft:Kozyris72541969@kolleris.mbmv.io:5652/kolleris?authSource=admin").then(() => console.log('Mongo Connected!'));

export default connectMongo;


