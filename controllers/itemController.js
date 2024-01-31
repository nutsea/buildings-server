const ApiError = require('../error/apiError')
const { Item, Step, Object, File } = require('../models/models')
const { Sequelize } = require('sequelize')
const fs = require('fs')
const path = require('path')

class ItemController {
    async create(req, res, next) {
        try {
            const { name, total, total_non_cash, paid_cash, paid_non_cash, step_id, is_work } = req.body
            const item = await Item.create({ name, total, total_non_cash, paid_cash, paid_non_cash, step_id, is_work })
            const step = await Step.findOne({ where: { step_id } })
            const object_id = step.object_id
            const object = await Object.findOne({ where: { object_id } })
            if (total) object.total -= Number(step.total)
            if (total_non_cash) object.total_non_cash -= Number(step.total_non_cash)
            if (total) step.total += Number(total)
            if (total_non_cash) step.total_non_cash += Number(total_non_cash)
            if (paid_cash) step.paid_cash += Number(paid_cash)
            if (paid_non_cash) step.paid_non_cash += Number(paid_non_cash)
            if (total) object.total += Number(step.total)
            if (total_non_cash) object.total_non_cash += Number(step.total_non_cash)
            await step.save()
            await object.save()
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async update(req, res, next) {
        try {
            const { item_id, name, total, total_non_cash, paid_cash, paid_non_cash } = req.body
            const item = await Item.findOne({ where: { item_id } })
            if (item) {
                const step_id = item.step_id
                const step = await Step.findOne({ where: { step_id } })
                const object_id = step.object_id
                const object = await Object.findOne({ where: { object_id } })
                if (total) object.total -= Number(step.total)
                if (total_non_cash) object.total_non_cash -= Number(step.total_non_cash)
                if (total) step.total -= Number(item.total)
                if (total_non_cash) step.total_non_cash -= Number(item.total_non_cash)
                if (paid_cash) step.paid_cash -= Number(item.paid_cash)
                if (paid_non_cash) step.paid_non_cash -= Number(item.paid_non_cash)
                item.name = name
                item.total = total
                item.total_non_cash = total_non_cash
                item.paid_cash = paid_cash
                item.paid_non_cash = paid_non_cash
                item.save()
                if (total) step.total += Number(total)
                if (total_non_cash) step.total_non_cash += Number(total_non_cash)
                if (paid_cash) step.paid_cash += Number(paid_cash)
                if (paid_non_cash) step.paid_non_cash += Number(paid_non_cash)
                if (total) object.total += Number(step.total)
                if (total_non_cash) object.total_non_cash += Number(step.total_non_cash)
                await step.save()
                await object.save()
            }
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async createForAll(req, res, next) {
        try {
            const { name, total, total_non_cash, paid_cash, paid_non_cash, step_num, is_work } = req.body
            const objects = await Object.findAll()
            let total_divided = 0
            let total_non_cash_divided = 0
            let paid_cash_divided = 0
            let paid_non_cash_divided = 0
            if (total > 0) {
                total_divided = total / objects.length
                total_divided = total_divided.toFixed(2)
            }
            if (total_non_cash > 0) {
                total_non_cash_divided = total_non_cash / objects.length
                total_non_cash_divided = total_non_cash_divided.toFixed(2)
            }
            if (paid_cash > 0) {
                paid_cash_divided = paid_cash / objects.length
                paid_cash_divided = paid_cash_divided.toFixed(2)
            }
            if (paid_non_cash > 0) {
                paid_non_cash_divided = paid_non_cash / objects.length
                paid_non_cash_divided = paid_non_cash_divided.toFixed(2)
            }
            const steps = await Step.findAll({ where: { number: step_num } })
            let items = []
            for (let i of steps) {
                const item = await Item.create({ name, total: total_divided, total_non_cash: total_non_cash_divided, paid_cash: paid_cash_divided, paid_non_cash: paid_non_cash_divided, step_id: i.step_id, is_work })
                items.push(item)
                if (total > 0) i.total += Number(total_divided)
                if (total_non_cash > 0) i.total_non_cash += Number(total_non_cash_divided)
                if (paid_cash > 0) i.paid_cash += Number(paid_cash_divided)
                if (paid_non_cash > 0) i.paid_non_cash += Number(paid_non_cash_divided)
                await i.save()
            }
            for (let i of objects) {
                if (total > 0) i.total += Number(total_divided)
                if (total_non_cash > 0) i.total_non_cash += Number(total_non_cash_divided)
                await i.save()
            }
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async createForChosen(req, res, next) {
        try {
            const { name, total, total_non_cash, paid_cash, paid_non_cash, step_num, objects_arr, is_work } = req.body
            const objects = await Object.findAll({
                where: {
                    object_id: {
                        [Sequelize.Op.in]: objects_arr
                    }
                }
            })
            let total_divided = 0
            let total_non_cash_divided = 0
            let paid_cash_divided = 0
            let paid_non_cash_divided = 0
            if (total > 0) {
                total_divided = total / objects.length
                total_divided = total_divided.toFixed(2)
            }
            if (total_non_cash > 0) {
                total_non_cash_divided = total_non_cash / objects.length
                total_non_cash_divided = total_non_cash_divided.toFixed(2)
            }
            if (paid_cash > 0) {
                paid_cash_divided = paid_cash / objects.length
                paid_cash_divided = paid_cash_divided.toFixed(2)
            }
            if (paid_non_cash > 0) {
                paid_non_cash_divided = paid_non_cash / objects.length
                paid_non_cash_divided = paid_non_cash_divided.toFixed(2)
            }
            const steps = await Step.findAll({ 
                where: { 
                    number: step_num,
                    object_id: {[Sequelize.Op.in]: objects_arr}
                } 
            })
            let items = []
            for (let i of steps) {
                const item = await Item.create({ name, total: total_divided, total_non_cash: total_non_cash_divided, paid_cash: paid_cash_divided, paid_non_cash: paid_non_cash_divided, step_id: i.step_id, is_work })
                items.push(item)
                if (total > 0) i.total += Number(total_divided)
                if (total_non_cash > 0) i.total_non_cash += Number(total_non_cash_divided)
                if (paid_cash > 0) i.paid_cash += Number(paid_cash_divided)
                if (paid_non_cash > 0) i.paid_non_cash += Number(paid_non_cash_divided)
                await i.save()
            }
            for (let i of objects) {
                if (total > 0) i.total += Number(total_divided)
                if (total_non_cash > 0) i.total_non_cash += Number(total_non_cash_divided)
                await i.save()
            }
            return res.json(items)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getBySearch(req, res, next) {
        try {
            const { search } = req.query
            const items = await Item.findAll({ where: { name: {[Sequelize.Op.like]: `%${search}%`} } })
            const steps = await Step.findAll({
                where: {
                    step_id : {[Sequelize.Op.in]: items.map(item => item.step_id)}
                }
            })
            const objects = await Object.findAll({ 
                where: { 
                    [Sequelize.Op.or]: [
                        { name: { [Sequelize.Op.like]: `%${search}%` } },
                        { object_id: { [Sequelize.Op.in]: steps.map(step => step.object_id) } }
                    ]
                } 
            })
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
                    paid_non_cash: 0,
                    createdAt: i.createdAt
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
            }
            return res.json(newObjects)
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

    async deleteItem(req, res, next) {
        try {
            const { item_id } = req.query
            const item = await Item.findOne({ where: { item_id } })
            if (item) {
                const step_id = item.step_id
                const step = await Step.findOne({ where: { step_id } })
                const object_id = step.object_id
                const object = await Object.findOne({ where: { object_id } })
                object.total -= item.total
                object.total_non_cash -= item.total_non_cash
                step.total -= item.total
                step.total_non_cash -= item.total_non_cash
                step.paid_cash -= item.paid_cash
                step.paid_non_cash -= item.paid_non_cash
                const files = await File.findAll({ where: { item_id } })
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
                await item.destroy()
                await step.save()
                await object.save()
            }
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new ItemController()