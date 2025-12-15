import aj from "../config/arcjet.js"

const arcjetMiddleware = async (req, res, next)=>{
    try {
        const decision = await aj.protect(req,{requested:1})

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message: "Too many requests"})
            }
            if(decision.reason.isBot()){
                return res.status(401).json({message: "Bot detected"})
            }
            if(decision.reason.isChallenge()){
                return res.status(401).json({message: "Unauthorized"})
            }
            return res.status(403).json({message: "Access Denied"})
        }
        next()
    } catch (error) {
        console.log(`Arcjet middleware error: ${error} | ${error.stack} | ${error.message}`)
        next(error)
    }
}

export default arcjetMiddleware