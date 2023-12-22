const Router = require('express')
const router = new Router()
const stepController = require('../controllers/stepController')

router.get('/', stepController.getOne)
router.get('/forobject', stepController.getForObject)
router.get('/summary', stepController.getSummary)

module.exports = router