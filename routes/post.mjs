import express from 'express'
import { client } from './../mongoDb.mjs'
// Importing objectid form mongo database
import { ObjectId } from 'mongodb'
import { customAlphabet } from 'nanoid'; //Generates Random ID
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10); // Customize ID  
// Pinecone OpenAi 
import pineconeClient, { openAi as OpenAiClient }
    from './../pinecone.mjs';


// name of Database 
const db = client.db("CurdDb-React");
// we can create collection as many as we want in one Database
const col = db.collection('postsWithReact'); /// Name of Collection




let router = express.Router();

// To Create post url:api/v1/post request:post 
router.post('/post', async (req, res, next) => {
    if (
        !req.body.title
        || !req.body.text
    ) {
        res.status(403).send(
            `Required Parameter is missing 
        Example:
        {
            title: "Post Title",
            text: "Some POst Text"
        }`)
        return;
    }

    try {
        //-----Converting Data in Vector-----//
        const response = await OpenAiClient.embeddings.create({
            // model: 'text-davinci-002',
            model: 'text-embedding-ada-002',
            input: `${req.body.title} ${req.body.text}`
        });
        const vector = response?.data[0]?.embedding
        console.log("vector", vector);

        //----- Storing Data in pinecone Database -----// 
        const index = pineconeClient.index(process.env.PINECONE_INDEX_NAME);

        const upsertResponse = await index.upsert([{
            id: nanoid(),
            values: vector,
            metadata: {
                title: req.body.title,
                text: req.body.text,
                createdOn: new Date().getTime()
            },
        }]);
        console.log("upsertResponse", upsertResponse);


        res.send({ message: 'Post Created' });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error please try again later');
    }
});

// To get all post url:api/v1/posts request:get 
router.get('/posts', async (req, res, next) => {
    //--- Gating All Data From Vector Database ---//
    try {
        const response = await OpenAiClient.embeddings.create({
            model: 'text-embedding-ada-002',
            input: "",
        });
        const vector = response?.data[0]?.embedding
        console.log("vector", vector);

        const index = pineconeClient.index(process.env.PINECONE_INDEX_NAME);
        const queryResponse = await index.query({
            values: vector,
            topK: 10000,
            includeValues: true,
            includeMetadata: true,
        });
        queryResponse.matches.map(eachMatch => {
            console.log(`Score: ${eachMatch.score.toFixed(1)} => ${JSON.stringify(eachMatch.metadata)}\n\n`)
        });
        console.log(`${queryResponse.matches.length} Record Not Found`);

        const OutputResponse = queryResponse.matches.map(eachMatch => ({
            text: eachMatch?.metadata?.text,
            title: eachMatch?.metadata?.title,
            _id: eachMatch?.id,
        }))
        res.send(OutputResponse);

    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send('Server Error please try again later');
    }

});





// To get post with iD url:api/v1/post/:postID request:get 
router.get('/post/:postId', async (req, res, next) => {
    // cheaking the id form mongodb otherwise app will be crashed
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send(`Post Id is Invalid`);
        return;
    }

    // _id is an object so we have to convert req.params.postId to object from string 
    try {
        let result = await col.findOne({ _id: new ObjectId(req.params.postId) });//always new parameter is needed while using ObjectId
        console.log("result", result);
        res.send(result)
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error please try again later');
    }
});

// To Edit post with iD url:api/v1/post/:postID request:Edit 
router.put('/post/:postId', async (req, res, next) => {
    if (!req.body.title
        && !req.body.text) {
        res.status(403).send(`
        At least one parameter is Required
        Example:{
            title:"Updated Title"
            text:"Updated text"
        }
        `);
        return;
    }

    try {
        //-----Converting Data in Vector-----//
        const response = await OpenAiClient.embeddings.create({
            // model: 'text-davinci-002',
            model: 'text-embedding-ada-002',
            input: `${req.body.title} ${req.body.text}`
        });
        const vector = response?.data[0]?.embedding
        console.log("vector", vector);

        const index = pineconeClient.index(process.env.PINECONE_INDEX_NAME);

        const upsertResponse = await index.upsert([{
            id: req.params.postId,
            values: vector,
            metadata: {
                title: req.body.title,
                text: req.body.text,
            },
        }]);
        console.log("upsertResponse", upsertResponse);


        res.send({ message: 'Post Edited' });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error please try again later');
    }
});

// To Delete post with iD url:api/v1/post/:postID request:delete 
router.delete('/post/:postId', async (req, res, next) => {

    //------Delete Api Pinecone Database------//
    const deleteResponse = await index.deleteOne(req.params.postId);
    console.log("deleteResponse", deleteResponse);
    res.send(`Post Deleted`)


});





















export default router
