import mongoose from "mongoose";

// database connection
export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO Atlas database connected");
    }
    catch (err) {
        console.log(err);
    }
};
