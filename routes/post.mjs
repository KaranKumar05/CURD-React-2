import express from 'express'
import { client } from './../mongoDb.mjs'
// Importing objectid form mongo database
import { ObjectId } from 'mongodb'

import { customAlphabet } from 'nanoid'; //Generates Random ID
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10); // Customize ID  


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

    // inserting data to mongo Database / Creating new post 
    try {
        const insertResponse = await col.insertOne({
            title: req.body.title,
            text: req.body.text,
            createdOn: new Date()
        });
        console.log("insertResponse", insertResponse);

        res.send({ message: 'Post Created'});
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error please try again later');
    }
});

// To get all post url:api/v1/posts request:get 
router.get('/posts', async (req, res, next) => {
    // -1 = descending, 1 = ascending order 
    const cursor = col.find({})
    .sort({_id: -1})// sorting to show new post at top
    .limit(100); // limiting the post to prevent form crashing or saving Ram and Cpu
    try {
        let results = await cursor.toArray();
        console.log("results", results);
        res.send(results);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error please try again later');
    }
})

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

    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send(`Post Id is Invalid`);
        return;
    }

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
    let dataToUpdate = {};

    if (req.body.title) { dataToUpdate.title = req.body.title }
    if (req.body.text) { dataToUpdate.text = req.body.text }

    try {
        const updatedResponse = await col.updateOne(
            {
                _id: new ObjectId(req.params.postId)
            },
            {
                $set: dataToUpdate
            });
        console.log("updatedResponse", updatedResponse);

        res.send('Post Updated')
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error please try again later');
    }
});

// To Delete post with iD url:api/v1/post/:postID request:delete 
router.delete('/post/:postId', async (req, res, next) => {
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send(`Post Id is Invalid`);
        return;
    }

    try {
        const deleteResponse = await col.deleteOne({ _id: new ObjectId(req.params.postId) })
        console.log("DeletedResponse: ", deleteResponse);
        // cheaking the count if deleting post for first time deletedCount is 1 or second time it will be 0
        if(deleteResponse.deletedCount === 0){ // Send response to user to tell post was deleted previously
            res.send("Post Was Deleted");
            return
        }
        res.send("Post Deleted Successfully");
    } catch (error) {
        console.log('Error in inserting mongoDb:', error);
        res.status(500).send('Server Error PLease try again later');
    }
});





















export default router
