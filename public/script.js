let create_room_btn = document.querySelector(".create_new_room")
let join_room_inp = document.querySelector(".join")
let join_room_btn = document.querySelector(".join_room")

join_room_btn.onclick = () => {
    let room_id = join_room_inp.value
    if (room_id.length > 0) {
        location.href = `/${room_id}`
    }
}
async function generateRoomId() {
    try {
        let res = await fetch("/new_room_id")
        if (res.status == 200) {
            let { id } = await res.json()
            return id
        } else {
            throw new Error("Error")
        }
    } catch (err) {
        throw new Error(err.message)
    }
}

create_room_btn.onclick = async function () {
    // let room_id = v4()
    try {
        let room_id = await generateRoomId()
        location.href = room_id
    } catch (err) {
        alert(err.message)
    }
}

//extra work

// import * as Comlink from "comlink"
// import snappy from "snappy-pure"

// let canvas = document.createElement("canvas")
// let ctx = canvas.getContext("2d")
// let video = document.createElement("video")
// canvas.width = 300
// canvas.height = 300
// let c2 = document.createElement("canvas")
// let ctx2 = c2.getContext("2d")
// canvas.width = 300
// canvas.height = 300

// document.body.append(c2)
// navigator.mediaDevices
//     .getUserMedia({
//         video: true,
//         audio: false,
//     })
//     .then((stream) => {
//         video.srcObject = stream
//         video.onloadedmetadata = () => {
//             video.play()
//             canvas.width = video.videoWidth
//             canvas.height = video.videoHeight
//             c2.width = video.videoWidth
//             c2.height = video.videoHeight

//             setTimeout(() => {
//                 requestAnimationFrame(draw)
//             }, 1000)
//         }
//     })

// // data = [...r, -2, ...g, -2, ...b, -2, ...a] convention
// // pirData = [repeat, pixel, -1]

// const worker = new Worker("./worker.js")
// const c = Comlink.wrap(worker)

// async function draw() {
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
//     let data = ctx.getImageData(0, 0, canvas.width, canvas.height)
//     // let fData = await c.compress(pData)
//     // console.log(fData)
//     // let decompressedData = await c.decompress(fData)
//     let pData = new Array(data.data)
//     let fData = snappy.compress(pData)
//     consolelog(fData)
//     // let imageData = new ImageData(
//     //     Uint8ClampedArray.from(decompressedData),
//     //     canvas.width,
//     //     canvas.height
//     // )
//     // ctx2.putImageData(imageData, 0, 0)
//     requestAnimationFrame(draw)
// }

// function draw() {
//     ctx.fillStyle = "white"
//     ctx.fillRect(0, 0, canvas.width, canvas.height)
//     ctx.beginPath()
//     ctx.fillStyle = "black"
//     let x = Math.floor(Math.random() * canvas.width)
//     let y = Math.floor(Math.random() * canvas.height)
//     ctx.rect(x, y, 10, 10)
//     ctx.fill()
//     requestAnimationFrame(draw)
// }
// requestAnimationFrame(draw)

// let stream = canvas.captureStream(120)

// video.srcObject = stream
// document.body.append(video)
// video.play()
