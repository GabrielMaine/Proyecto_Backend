export const authorizeAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'admin') {
            return next()
        } else {
            return res.status(403).json({ error: 'Unauthorized access' })
        }
    } else {
        return res.redirect('/login')
    }
}

export const authorizeUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'user') {
            return next()
        } else {
            return res.status(403).json({ error: 'Unauthorized access' })
        }
    } else {
        return res.redirect('/login')
    }
}
