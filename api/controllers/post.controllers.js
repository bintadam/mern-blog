import { errorHandler } from "../utils/error.js"
import Post from "../models/post.model.js"

export const create = async (req, res, next) => {
    if(!req.user.isAdmin ){
        return next(errorHandler(403, 'You are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Please provide all required fields'))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')
    const newPost = new Post({
        ...req.body, 
        slug, 
        userId:req.user.id
    });
    try{
        const savedPost =  await newPost.save()
        res.status(200).json(savedPost)
    }catch(error){
        next(error)
    }
}


export const getposts = async(req, res, next) => {
    try{
        const startIndex = parseInt(req.query.startIndex) || 0; //we wanna know which post to start fetching
        const limit = parseInt(req.query.limit) || 9; // this is limiting by not shoiwng all the posts but a limited number then later by click more more posts to show
        const sortDirection = req.query.order === 'asc' ? 1 : -1 // this is showing either by ascending direction or descending
        const posts = await  Post.find({ //
            ...(req.query.userId && {userId: req.body.userId}),
            ...(req.query.slug && {userId: req.body.slug}),
            ...(req.query.category && {userId: req.body.category}),
            ...(req.query.postId && {userId: req.body.postId}),
            ...(req.query.searchTerm && {
                $or:[ // allows us to search between 2 places
                    {title:{$regex: req.query.searchTerm, $options: 'i'}},// regex inside the title and options the case is not important
                    {content:{$regex: req.query.content, $options: 'i'}}
                ],
            }),
    })
        .sort({updatedAt: sortDirection})/// this is sorting by the updated at and sortdirection
        .skip(startIndex)
        .limit(limit)

    const totalPosts = await Post.countDocuments() /// this is method getting  the total post
    const now = new Date()
    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() -1,
        now.getDate(),
    )

    const lastMonthPosts = await Post.countDocuments({
        createdAt: {$gte:oneMonthAgo},
    });
    res.status(200).json({posts, totalPosts, lastMonthPosts})

    }catch(error){
        next(error)
    }
}