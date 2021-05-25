const express = require("express")
const ejs = require("ejs")
const socketio = require("socket.io")
const http = require("http")

require("dotenv").config()

const app = express()
const httpServer = http.Server(app)

httpServer.listen(process.env.PORT || 3000, () => {
    console.log("listining to port 3000")
})

//peer server -> put it in server file
// const { PeerServer } = require("peer")
// const peerserver = PeerServer({
//     port: 3001,
//     path: "/",
// })
// peerserver.on("connection", (client) => {
//     console.log(`Connection ${client.id}`)
// })
// peerserver.on("disconnect", (client) => {
//     console.log(`Disconnected ${client.id}`)
// })
//

// const https = require("https")
// const fs = require("fs")
// const privateKey = fs.readFileSync("./https/key.pem", "utf8")
// const certificate = fs.readFileSync("./https/cert.pem", "utf8")
// const credentials = { key: privateKey, cert: certificate }

// const httpsServer = https.createServer(credentials, app)
// httpsServer.listen(80, () => {
//     console.log("secure server listining to port 80")
// })
// const io = socketio(httpsServer)

const io = socketio(httpServer)
io.on("connection", (s) => {
    s.on("join-room", (room_id, user_id) => {
        s.join(room_id)
        s.to(room_id).broadcast.emit("user-connected", user_id)

        s.on("disconnect", () => {
            s.to(room_id).broadcast.emit("user-disconnected", user_id)
        })
    })
})

// app.use("/peerjs", peerServer)
app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/new_room_id", (req, res) => {
    res.json({
        id: 123,
    })
})
app.get("/:id", (req, res) => {
    let { id } = req.params
    res.render("room", { id })
})
