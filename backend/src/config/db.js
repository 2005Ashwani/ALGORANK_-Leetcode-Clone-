const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
async function main() {
    await mongoose.connect(process.env.DB_CONNECT_STRING)


}

module.exports = main


