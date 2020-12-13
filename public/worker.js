importScripts("https://unpkg.com/comlink/dist/umd/comlink.js")

function compress(pData) {
    let [sr, sg, sb, sa] = [1, 1, 1, 1]
    let [cr, cg, cb, ca] = [pData[0], pData[1], pData[2], pData[3]]
    let [dr, dg, db, da] = [[], [], [], []]
    for (let i = 4; i < pData.length; i += 4) {
        let r = pData[i]
        let g = pData[i + 1]
        let b = pData[i + 2]
        let a = pData[i + 3]
        if (cr < r + 4 && cr > r - 4) {
            sr++
        } else {
            dr.push(sr, cr)
            cr = r
            sr = 1
        }
        if (cg < g + 4 && cg > g - 4) {
            sg++
        } else {
            dg.push(sg, cg)
            cg = g
            sg = 1
        }
        if (cb < b + 4 && cb > b - 4) {
            sb++
        } else {
            db.push(sb, cb)
            cb = b
            sb = 1
        }
        if (ca < a + 4 && ca > a - 4) {
            sa++
        } else {
            da.push(sa, ca)
            ca = a
            sa = 1
        }
        if (i == pData.length - 4) {
            da.push(sa, ca)
            ca = a
            sa = 1
        }
    }
    let fData = [...dr, -1, ...dg, -1, ...db, -1, ...da]
    return fData
}
function decompress(fData) {
    let data = []
    let counter = 0
    let offset = 1
    let length = fData.length

    for (let i = 0; i < length; i += 2) {
        if (fData[i] == -1) {
            i++
            counter = offset
            offset++
        }
        let repeat = fData[i]
        let value = fData[i + 1]
        for (let j = 0; j < repeat; j++) {
            data[counter] = value
            counter += 4
        }
    }
    return data
}
Comlink.expose({
    compress,
    decompress,
})
