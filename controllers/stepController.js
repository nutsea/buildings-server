const ApiError = require('../error/apiError')
const { Step } = require('../models/models')

class StepController {
    async getOne(req, res, next) {
        try {
            const { step_id } = req.query
            const step = await Step.findOne({ where: { step_id } })
            return res.json(step)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getForObject(req, res, next) {
        try {
            const { object_id } = req.query
            const steps = await Step.findAll({ where: { object_id } })
            return res.json(steps)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getNumberSum(req, res, next) {
        try {
            const { number } = req.query
            const steps = await Step.findAll({ where: { number } })
            let sum = 0
            for (let i of steps) {
                sum += i.total
            }
            return res.json(sum)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getSummary(req, res, next) {
        try {
            const steps = await Step.findAll()
            let total = 0
            let cash = 0 
            let non_cash = 0
            let total1 = 0
            let total2 = 0
            let total3 = 0
            let total4 = 0
            for (let i of steps) {
                total += i.total
                cash += i.paid_cash
                non_cash += i.paid_non_cash
                switch (i.number) {
                    case 1:
                        total1 += i.total
                        break
                    case 2:
                        total2 += i.total
                        break
                    case 3:
                        total3 += i.total
                        break
                    case 4:
                        total4 += i.total
                        break
                    default:
                        break
                }
            }
            let summary = { total, cash, non_cash, total1, total2, total3, total4 }
            return res.json(summary)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new StepController()