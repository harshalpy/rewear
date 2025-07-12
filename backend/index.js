import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

// 
import ConnectMongodb from './src/libs/mongo.js'
import MainRouter from './src/MainRouter.js';


dotenv.config({});
const app = express()

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use('/api' , MainRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`);
    ConnectMongodb();
})