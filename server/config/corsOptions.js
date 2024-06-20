const origins = [
    'http://localhost:3000',
]

const corsOptions = {
    origin: (origin, callback) => {
        if (origins.indexOf(origin) != -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('Not allowed'))
        }
    },
    credentials: true,
    optionSuccessStatus: 200
}

module.exports = corsOptions
