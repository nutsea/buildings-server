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
            let newObjects = []
            for (let i of objects) {
                const steps = await Step.findAll({where: {object_id: i.object_id}})
                let objectTmp = {
                    object_id: i.object_id,
                    name: i.name,
                    total: i.total,
                    total_non_cash: i.total_non_cash,
                    floor: i.floor,
                    paid_cash: 0,
                    paid_non_cash: 0
                }
                let paid_cash = 0
                let paid_non_cash = 0
                for (let j of steps) {
                    paid_cash += j.paid_cash
                    paid_non_cash += j.paid_non_cash
                }
                objectTmp.paid_cash = paid_cash
                objectTmp.paid_non_cash = paid_non_cash
                newObjects.push(objectTmp)
                console.log(objectTmp)
            }
            return res.json(newObjects)
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