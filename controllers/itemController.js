const ApiError = require('../error/apiError')
const { Item, Step, Object } = require('../models/models')

class ItemController {
    async create(req, res, next) {
        try {
            const { name, total, paid_cash, paid_non_cash, step_id } = req.body
            const item = await Item.create({ name, total, paid_cash, paid_non_cash, step_id })
            const step = await Step.findOne({ where: { step_id } })
            const object_id = step.object_id
            const object = await Object.findOne({ where: { object_id } })
            object.total -= step.total
            step.total += total
            if (paid_cash) step.paid_cash += paid_cash
            if (paid_non_cash) step.paid_non_cash += paid_non_cash
            object.total += step.total
            await step.save()
            await object.save()
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async createForAll(req, res, next) {
        try {
            const { name, total, paid_cash, paid_non_cash, step_num } = req.body
            const objects = await Object.findAll()
            let total_divided = total / objects.length
            total_divided = total_divided.toFixed(2)
            let paid_cash_divided = paid_cash / objects.length
            paid_cash_divided = paid_cash_divided.toFixed(2)
            let paid_non_cash_divided = paid_non_cash / objects.length
            paid_non_cash_divided = paid_non_cash_divided.toFixed(2)
            const steps = await Step.findAll({ where: { number: step_num } })
            let items = []
            for (let i of steps) {
                const item = await Item.create({ name, total_divided, paid_cash_divided, paid_non_cash_divided, step_id: i.step_id })
                items.push(item)
            }
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async createForChosen(req, res, next) {
        try {

        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getForStep(req, res, next) {
        try {
            const { step_id } = req.query
            const items = await Item.findAll({ where: { step_id } })
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new ItemController()