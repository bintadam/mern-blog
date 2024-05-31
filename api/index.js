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


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500 // statusCode comes from the error if there is no statuscode then 500
    const message = err.message || 'Internet Server Error' /// this is the same as the statuscode if there is no error message then we use the one above
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
}) /// next used when going to the next middleware