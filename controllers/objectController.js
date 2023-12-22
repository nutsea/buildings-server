const ApiError = require('../error/apiError')
const { Object, Step, Item } = require('../models/models')

class ObjectController {
    async create(req, res, next) {
        try {
            const { name, floor } = req.body
            const object = await Object.create({ name, floor })
            const object_id = object.object_id
            for (let i = 0; i < 5; i++) {
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

    async deleteOne(req, res, next) {
        try {
            const { object_id } = req.query
            const object = await Object.findOne({ where: { object_id } })
            const steps = await Step.findAll({ where: { object_id } })
            for (let i of steps) {
                const items = await Item.findAll({ where: { step_id: i.step_id } })
                for (let j of items) {
                    await j.destroy()
                }
                await i.destroy()
            }
            await object.destroy()
            return res.json(object)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new ObjectController()