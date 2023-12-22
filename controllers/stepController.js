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

    async getSummary(req, res, next) {
        try {
            const steps = await Step.findAll()
            let total = 0
            let total_non_cash = 0
            let cash = 0 
            let non_cash = 0
            let total1 = 0
            let total1_non_cash = 0
            let total2 = 0
            let total2_non_cash = 0
            let total3 = 0
            let total3_non_cash = 0
            let total4 = 0
            let total4_non_cash = 0
            let total5 = 0
            let total5_non_cash = 0
            for (let i of steps) {
                total += i.total
                total_non_cash += i.total_non_cash
                cash += i.paid_cash
                non_cash += i.paid_non_cash
                switch (i.number) {
                    case 1:
                        total1 += i.total
                        total1_non_cash += i.total_non_cash
                        break
                    case 2:
                        total2 += i.total
                        total2_non_cash += i.total_non_cash
                        break
                    case 3:
                        total3 += i.total
                        total3_non_cash += i.total_non_cash
                        break
                    case 4:
                        total4 += i.total
                        total4_non_cash += i.total_non_cash
                        break
                    case 5:
                        total5 += i.total
                        total5_non_cash += i.total_non_cash
                        break
                    default:
                        break
                }
            }
            let summary = { total, total_non_cash, cash, non_cash, total1, total1_non_cash, total2, total2_non_cash, total3, total3_non_cash, total4, total4_non_cash, total5, total5_non_cash }
            return res.json(summary)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new StepController()