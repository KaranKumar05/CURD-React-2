import express from 'express';
import path from 'path';
import cors from 'cors'
import 'dotenv/config' //Environment variable (process.env)

//----- ROUTERS -----//
import postRouter from './routes/post.mjs';//Post Router






const __dirname = path.resolve();
const app = express();
app.use(express.json()) //Body Parser
app.use(cors()); // Cors Module when Front-End on different Url and Back-End on Different Url


app.use('/api/v1', postRouter);
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is Running on Port:${PORT}`);
});