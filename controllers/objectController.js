const ApiError = require('../error/apiError')
const { Object, Step } = require('../models/models')

class ObjectController {
    async create(req, res, next) {
        try {
            const { name } = req.body
            const object = await Object.create({ name })
            const object_id = object.object_id
            for (let i = 0; i < 4; i++) {
                let number = i + 1
                const step = await Step.create({ object_id, number })
            }
            return res.json(object)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getOne(req, res, next) {
        try {
            const { object_id } = req.query
            const object = await Object.findOne({ where: { object_id } })
            return res.json(object)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getAll(req, res, next) {
        try {
            const objects = await Object.findAll()
            return res.json(objects)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getSum(req, res, next) {
        try {
            const objects = await Object.findAll()
            let sum = 0
            for (let i of objects) {
                sum += i.total
            }
            return res.json(sum)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new ObjectController()