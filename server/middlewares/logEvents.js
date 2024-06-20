const {format} = require('date-fns')

const path = require('path')

const date = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`

const logger = (req, res, next) => {
    const source = req.headers['x-forwarded-for'];
    console.log(`\n${req.method}\t${req.path}\tat ${date}\tfrom ${req.headers.origin}`);
    next()
}
module.exports = {logger}