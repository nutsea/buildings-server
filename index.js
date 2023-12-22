require('dotenv').config()
const express = require('express')
const sequelize = require('./db.js')
const models = require('./models/models.js')
const cors = require('cors')
const router = require('./routes/index.js')
const path = require('path');

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/api', router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()