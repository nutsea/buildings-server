const Router = require('express')
const router = new Router()
const fileController = require('../controllers/fileController')
const multer = require('multer')
const upload = multer({ dest: 'static/' })

router.post('/', upload.array('file'), fileController.create)
router.get('/', fileController.getAll)
router.delete('/', fileController.delete)

module.exports = router