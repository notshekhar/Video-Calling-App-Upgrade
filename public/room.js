let video_count = 0

let socket = io("/")
// const user_id = v4()
let calls = {}

//production
const peer = new Peer(undefined, {
    host: "https://paperpeerserver.herokuapp.com",
    port: 443,
})

//development
// const peer = new Peer(undefined, {
//     host: "/",
//     port: 3001,
// })
peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id)
})
peer.on("connection", (connection) => {
    console.log(connection)
})
socket.on("user-disconnected", (uid) => {
    console.log("disconnected", uid)
    if (calls[uid]) calls[uid].close()
})

function hasMediaDevises() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

if (hasMediaDevises()) {
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: true,
        })
        .then((stream) => {
            window.stream = stream
            const myVideo = document.createElement("video")
            myVideo.muted = true
            addVideo(myVideo, stream)
            peer.on("call", (call) => {
                console.log("recevied a call")
                call.answer(stream)
                let video = document.createElement("video")
                call.on("stream", (userVideoStream) => {
                    addVideo(video, userVideoStream)
                    recalculateLayout()
                })
            })
            // peer.on("error", (err) => console.log(err))
            socket.on("user-connected", (user) => {
                console.log("new connection in room", user)
                setTimeout(() => {
                    conntectToUser(user, stream)
                }, 1000)
            })
            recalculateLayout()
        })
} else {
    console.log("mediaDevice not suported in your device")
}

function conntectToUser(uid, stream) {
    const call = peer.call(uid, stream)
    console.log("calling", uid)
    const video = document.createElement("video")
    call.on("stream", (userVideoStream) => {
        addVideo(video, userVideoStream)
        recalculateLayout()
    })
    call.on("close", () => {
        video.remove()
        recalculateLayout()
    })
    calls[uid] = call
    // call.on("error", (err) => console.log(err))
}

function addVideo(video, stream, muted) {
    let left = document.querySelector(".gallery")
    let container = document.createElement("div")
    container.classList.add("video_container")
    video.srcObject = stream
    video.addEventListener("loadedmetadata", () => {
        video.play()
    })
    container.append(video)
    left.append(container)
    video_count++
}
