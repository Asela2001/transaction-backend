import RateLimit from "../config/upstash.js";

export const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await RateLimit.limit("under_limit");

        if (!success) {
            return res.status(429).json({
                error: "Too many requests, please try again later.",
            });
        }
        next();
    } catch (error) {
        console.log("Rate Limiter Error:", error);
        next(error);
    }
}

export default rateLimiter;