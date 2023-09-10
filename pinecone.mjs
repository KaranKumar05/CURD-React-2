
// Vector Database libraries
import { Pinecone } from '@pinecone/pinecone-js';
import OpenAI from 'openai';


// initialization OpenAi 
const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// initialization Pinecone 
const pinecone = new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
});

export default { openAi, pinecone };