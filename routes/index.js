const Router = require('express')
const router = new Router()
const itemRouter = require('./itemRouter')
const stepRouter = require('./stepRouter')
const objectRouter = require('./objectRouter')

router.use('/item', itemRouter)
router.use('/step', stepRouter)
router.use('/object', objectRouter)

module.exports = router