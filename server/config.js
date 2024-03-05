import mongoose from 'mongoose';

const connectMongo = async () => {
    if (mongoose.connection.readyState === 0) { // 0: disconnected
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "kolleris",
        });
        console.log('-- MongoDB Connected --!');
    }
};



const closeMongo = async () => mongoose.connection.close().then(() => console.log('Mongo Disconnected!'));
export { closeMongo };
export default connectMongo;


