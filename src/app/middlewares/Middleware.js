class Middleware{
    authorization = (request, response, next) => {
        const token = request.cookies.access_token;
        if (!token) { return response.sendStatus(403) }
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            request.userId = data.userId;
            return next();
        } catch {
            return response.sendStatus(403);
        }
    }
}

module.exports = new Middleware()
