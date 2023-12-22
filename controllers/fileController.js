const { Item, File } = require('../models/models')
const ApiError = require('../error/apiError')
const path = require('path')
const { Op } = require('sequelize')
const fs = require('fs')

class FileController {
    async create(req, res, next) {
        try {
            const { item_id } = req.body
            if (req.files) {
                const file = req.files
                for (let i of file) {
                    await File.create({ file: i.filename, item_id, name: i.originalname })
                }
                return res.json(item_id)
            } else {
                return res.json(item_id)
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const { item_id } = req.query
            const files = await File.findAll({ where: { item_id } })
            return res.json(files)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { toDelete } = req.query
            if (toDelete) {
                const files = await File.findAll({ where: { id: { [Op.in]: toDelete } } })
                if (files) {
                    for (let i of files) {
                        const filePath = path.resolve(__dirname, '..', 'static', i.file)
                        fs.unlink(filePath, (e) => {
                            if (e) {
                                console.log('Ошибка при удалении файла:', e)
                            } else {
                                console.log('Файл успешно удален')
                            }
                        })
                        await i.destroy()
                    }
                }
                return res.json('done')
            } else {
                return res.json('no images to delete')
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new FileController()