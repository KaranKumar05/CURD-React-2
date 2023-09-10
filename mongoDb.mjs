// Importing MongoDb 
import { MongoClient } from 'mongodb';
const uri = "mongodb+srv://Karan_Kumar:Umerkot1233@cluster0.ybu3vqr.mongodb.net/?retryWrites=true&w=majority";
// Exporting 
export const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        console.log("Atlas Connect Successfully");
    } catch (err) {
        console.log(err.stack);
        await client.close();
        process.exit(1); //If failed to connect to database it will exit your app
        // any value in () is shows that the app is terminated because of an error any non-zero value 
    }
}
run().catch(console.dir);

/// When mongoDb is connected make sure to close data base as the app is terminating
/// Run while terminating the app disconnecting the mongoDb (ctrl + C);
process.on('SIGINT', async function () {
    console.log("App is terminating");
    await client.close();
    process.exit(0);
    // 0 is () show that the app is terminated without error or terminated bt Developer 
});
