
// Vector Database libraries
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

// initialization OpenAi 
export const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, //Currently Don't Have
});


// initialization Pinecone 
const pinecone = new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
});

export default pinecone;
