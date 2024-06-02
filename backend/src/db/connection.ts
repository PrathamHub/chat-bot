import { log } from 'console'
import {connect} from 'mongoose'
import { disconnect } from 'process';
 async function connectToDatabase(){
try {
    await connect(process.env.MONGO_URL)
} catch (error) {
    console.log(error);
    throw new Error("Cannot connect to MongoDb")
}

}

async function disconnectFromDatabase(){
    try {
        await disconnect()
    } catch (error) {
        console.log(error);
        throw new Error("Could not disconnect from mongo")

        
    }
}
export {connectToDatabase,disconnectFromDatabase}