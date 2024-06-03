import mongoose from "mongoose";

const connect = async (URL) => {
    try {
        await mongoose.connect(URL);
    } catch (err) {
        console.log(err)
    }
}
export default connect
