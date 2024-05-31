import express from 'express'
import {test} from '../controllers/user.controller.js'

const router = express.Router()

router.use('/test', test) ///// test get request

export default router