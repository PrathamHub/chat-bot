import app from "./app.js"
import { connectToDatabase } from "./db/connection.js"
const port=process.env.PORT||5000


connectToDatabase().then(()=>{
    app.listen(port,()=>console.log("Server Open"))
}).catch((err)=>console.log(err))
