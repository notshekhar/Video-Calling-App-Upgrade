const nedb = require("nedb-promise")
const db = nedb({ filename: "room_id.db", autoload: true })

function generateId() {
    let { first, second, last } = {
        first: new Array(3)
            .fill(0)
            .map((e) => {
                let chs =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
                return chs[Math.floor(Math.random() * chs.length)]
            })
            .join(""),
        second: new Array(4)
            .fill(0)
            .map((e) => {
                let chs =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
                return chs[Math.floor(Math.random() * chs.length)]
            })
            .join(""),
        last: new Array(3)
            .fill(0)
            .map((e) => {
                let chs =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
                return chs[Math.floor(Math.random() * chs.length)]
            })
            .join(""),
    }
    return `${first}-${second}-${last}`
}
async function newID() {
    let id = generateId()
    let match = await db.findOne({ id })
    if (match) return newID()
    else {
        await db.insert({ id, created_date: new Date() })
        return id
    }
}
async function init() {
    let id = await newID()
    console.log(id)
}
init()
