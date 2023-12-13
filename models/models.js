const sequelize = require('../db.js')
const {DataTypes} = require('sequelize')

const Object = sequelize.define('objects', {
    object_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    total: {type: DataTypes.INTEGER, defaultValue: 0}
})

const Step = sequelize.define('steps', {
    step_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.INTEGER},
    total: {type: DataTypes.INTEGER, defaultValue: 0},
    paid_cash: {type: DataTypes.INTEGER, defaultValue: 0},
    paid_non_cash: {type: DataTypes.INTEGER, defaultValue: 0}
})

const Item = sequelize.define('items', {
    item_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    total: {type: DataTypes.INTEGER, defaultValue: 0},
    paid_cash: {type: DataTypes.INTEGER, defaultValue: 0},
    paid_non_cash: {type: DataTypes.INTEGER, defaultValue: 0}
})

Object.hasMany(Step, {foreignKey: 'object_id'})
Step.belongsTo(Object, {foreignKey: 'object_id'})

Step.hasMany(Item, {foreignKey: 'step_id'})
Item.belongsTo(Step, {foreignKey: 'step_id'})

module.exports = {
    Object,
    Step,
    Item
}