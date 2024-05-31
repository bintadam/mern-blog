import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'


const app = express()

app.use(express.json())

const PORT = 3000

dotenv.config()

mongoose.connect(process.env.MONGO).then(()=> console.log('MongoDB is connected')).catch(err => console.log(err))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.use('/api/user' , userRoutes)/// we are using use to get request 
app.use('/api/auth' , authRoutes)