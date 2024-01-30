const Router = require('express')
const router = new Router()
const itemController = require('../controllers/itemController')

router.post('/', itemController.create)
router.post('/update', itemController.update)
router.get('/bysearch', itemController.getBySearch)
router.post('/forall', itemController.createForAll)
router.post('/forchosen', itemController.createForChosen)
router.get('/forstep', itemController.getForStep)
router.delete('/', itemController.deleteItem)

module.exports = router