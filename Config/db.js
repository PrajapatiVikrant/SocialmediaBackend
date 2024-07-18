const mongoose = require("mongoose");
const { config } = require("dotenv")
config()
async function databaseConnectiviy(){
    try {
        const { connection } = await mongoose.connect(process.env.MONGOOSE_URL);
     if(connection){
        console.log(connection.host)
     }
    } catch (error) {
        console.log(error)
        process.exit();
    }
    
 
}

module.exports = databaseConnectiviy;