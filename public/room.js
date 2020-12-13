const PEER_SERVER =
    config.deploy != "dev" ? "https://paperpeerserver.herokuapp.com" : "/"
const PEER_PORT = config.deploy != "dev" ? 443 : 3001

function showLoading(message) {
    let loading = document.querySelector(".loading")
    loading.style.display = "flex"
    loading.innerHTML = message
}
function hideLoading() {
    let loading = document.querySelector(".loading")
    loading.style.display = "none"
    loading.innerHTML = ""
}
async function wakupPeerServerHeruko() {
    showLoading("Loading ...")
    fetch("https://paperpeerserver.herokuapp.com")
        .then((res) => {
            if (res.status == 200) {
                hideLoading()
                Init()
            } else {
                showLoading("Retry by refreshing the page")
            }
        })
        .catch((err) => {
            showLoading("Retry by refreshing the page")
        })
}
config.deploy != "dev" ? wakupPeerServerHeruko() : Init()

function Init() {
    showLoading("loading...")
    let video_count = 0

    let socket = io("/")
    // const user_id = v4()
    let calls = {}

    //production
    const peer = new Peer(undefined, {
        host: PEER_SERVER,
        secure: config.deploy != "dev" ? true : false,
        port: PEER_PORT,
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
                hideLoading()
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
        // let i = document.createElement("i")
        // i.class = "fas fa-volume-off"
        // i.class = "fas fa-volume-up"
        let i_mute = document.createElement("i")
        i_mute.classList.add("fas")
        i_mute.classList.add("video_mute")
        let i_mute_class = video.muted ? "fa-volume-mute" : "fa-volume-up"
        i_mute.classList.add(i_mute_class)
        i_mute.classList.add("fa-2x")
        if (!video.muted)
            i_mute.addEventListener("click", () => {
                if (i_mute.classList.contains("fa-volume-up")) {
                    i_mute.classList.remove("fa-volume-up")
                    i_mute.classList.add("fa-volume-mute")
                    i_mute.style.color = "red"
                    video.muted = true
                } else {
                    i_mute.classList.remove("fa-volume-mute")
                    i_mute.classList.add("fa-volume-up")
                    i_mute.style.color = "rgb(207, 207, 207)"
                    video.muted = false
                }
            })
        container.classList.add("video_container")
        video.srcObject = stream
        video.addEventListener("loadedmetadata", () => {
            video.width = video.videoWidth
            video.height = video.videoHeight
            video.play()
        })
        container.append(video, i_mute)
        left.append(container)
        video_count++
    }

    // call controls
    document.querySelector(".toggle_audio").addEventListener("click", toggleMic)
    function toggleMic() {
        const enabled = stream.getAudioTracks()[0].enabled
        let i = this.children[0]
        if (enabled) {
            stream.getAudioTracks()[0].enabled = false
            i.classList.remove("fa-microphone-alt")
            i.classList.add("fa-microphone-alt-slash")
        } else {
            //change icon
            stream.getAudioTracks()[0].enabled = true
            i.classList.add("fa-microphone-alt")
            i.classList.remove("fa-microphone-alt-slash")
        }
    }

    document
        .querySelector(".toggle_camera")
        .addEventListener("click", toggleCamera)
    function toggleCamera() {
        let enabled = stream.getVideoTracks()[0].enabled
        let i = this.children[0]
        if (enabled) {
            stream.getVideoTracks()[0].enabled = false
            //change icon
            i.classList.remove("fa-video")
            i.classList.add("fa-video-slash")
        } else {
            stream.getVideoTracks()[0].enabled = true
            i.classList.remove("fa-video-slash")
            i.classList.add("fa-video")
            //change icon
        }
    }
    document.querySelector(".call_cancel").addEventListener("click", callCancel)
    function callCancel() {
        location.href = "/"
        // peer.close()
    }

    //inside init
}
