const Router = require('express')
const router = new Router()
const objectController = require('../controllers/objectController')

router.post('/', objectController.create)
router.get('/one', objectController.getOne)
router.get('/all', objectController.getAll)
router.get('/sum', objectController.getSum)
router.delete('/', objectController.deleteOne)

module.exports = router