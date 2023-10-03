import { mongoose } from "mongoose";
const connectDB = async() =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to mongodb');
        // console.log(`mongo database is connected!!! ${conn.connection.host} `)
    } catch (error) {
        console.log(`mongo error ${error}`);
    }
}

export default connectDB;
