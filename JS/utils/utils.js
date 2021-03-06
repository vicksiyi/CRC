const { rejects } = require('assert')
const fs = require('fs')
var mid = {
    ' ': '00100000', '!': '00100001', '\"': '00100010', '#': '00100011',
    '$': '00100011', '%': '00100101', '&': '00100110', '\'': '00100111',
    '(': '00101000', ')': '00101001', '*': '00101010', '+': '00101011',
    ',': '00101100', '-': '00101101', '.': '00101110', '/': '00101111',
    '0': '00110000', '1': '00110001', '2': '00110010', '3': '00110011',
    '4': '00110100', '5': '00110101', '6': '00110110', '7': '00110111',
    '8': '00111000', '9': '00111001', ':': '00111010', ';': '00111011',
    '<': '00111100', '=': '00111101', '>': '00111110', '?': '00111111',
    '@': '01000000', 'A': '01000001', 'B': '01000010', 'C': '01000011',
    'D': '01000100', 'E': '01000101', 'F': '01000110', 'G': '01000111',
    'H': '01001000', 'I': '01001001', 'J': '01001010', 'K': '01001011',
    'L': '01001100', 'M': '01001101', 'N': '01001110', 'O': '01001111',
    'P': '01010000', 'Q': '01010001', 'R': '01010010', 'S': '01010011',
    'T': '01010100', 'U': '01010101', 'V': '01010110', 'W': '01010111',
    'X': '01011000', 'Y': '01011001', 'Z': '01011010', '[': '01011011',
    '\\': '01011100', ']': '01011101', '^': '01011110', '_': '01011111',
    '`': '01100000', 'a': '01100001', 'b': '01100010', 'c': '01100011',
    'd': '01100100', 'e': '01100101', 'f': '01100110', 'g': '01100111',
    'h': '01101000', 'i': '01101001', 'j': '01101010', 'k': '01101011',
    'l': '01101100', 'm': '01101101', 'n': '01101110', 'o': '01101111',
    'p': '01110000', 'q': '01110001', 'r': '01110010', 's': '01110011',
    't': '01110100', 'u': '01110101', 'v': '01110110', 'w': '01110111',
    'x': '01111000', 'y': '01111001', 'z': '01111010', '{': '01111011',
    '|': '01111100', '}': '01111101', '~': '01111110'
}

/**
 * 字符转ASCII(二进制格式)
 * @param {*} str 
 */
exports.charToAscii = function (str) {
    var toStr = ''
    for (var i = 0; i < str.length; ++i) {
        toStr += mid[str[i]]
    }
    return toStr
}

/**
 * 交换key & value
 * @param {*} middle 
 */
var exchange = function (middle) {
    var tmp = {}
    for (x in middle) {
        tmp[middle[x]] = x
    }
    return tmp
}

exports.asciiToChar = function (str) {
    var tmp = exchange(mid)
    var tmpStr = ''
    for (var i = 0; i < str.length; i += 8) {
        tmpStr += tmp[str.slice(i, i + 8)]
    }
    return tmpStr
}

/**
 * 将字符串编码
 * @param {*} str 
 */
exports.toEncode = function (str) {
    return encodeURI(str)
}

/**
 * 将字符串解码
 * @param {*} str 
 */
exports.toDecode = function (str) {
    return decodeURI(str)
}

/**
 * 检验余数
 * @param {*} R 
 */
exports.test = function (R) {
    for (var i = 0; i < R.length; ++i) {
        if (R[i] != '0') return 0
    }
    return 1
}

/**
 * 求余数
 * @param {*} M 被除数
 * @param {*} P 除数
 */
exports.auth = function (M, P) {
    var R = P
    var dist = 0
    // 跳过前面的 0
    for (let i = 0; i < M.length; ++i) {
        if (M[i] != '0') {
            dist = i
            break
        }
    }

    console.log(`dist:${dist}`)
    var status = 0
    while (dist <= M.length - P.length) {
        var tmp = []
        if (R.length != P.length) {
            R += M[dist + P.length - 1]
        }
        // console.log(R)
        if (R[0] == '0') {
            tmp = R.split("")
            delete tmp[0]
            R = tmp.join("")
            ++dist
            continue
        }
        for (var i = 0; i < P.length; ++i) {
            if (status < 4) {
                status++
                tmp.push(R[i] ^ M[dist + i])
            } else {
                tmp.push(R[i] ^ P[i])
            }
        }
        delete tmp[0]
        R = tmp.join("")
        ++dist
    }
    return R
}

/**
 * 读取文件
 * @param {*} dir 
 */
exports.readFile = function (dir) {
    return new Promise((resolve, rejects) => {
        fs.readFile(dir, 'utf-8', (err, data) => {
            if (err) rejects(err)
            resolve(data)
        })
    })
}

/**
 * 保存文件
 * @param {*} str 
 */
exports.writeFile = function (str, filename) {
    const data = new Uint8Array(Buffer.from(str));
    return new Promise((resolve, rejects) => {
        fs.writeFile(filename, data, (err) => {
            if (err) rejects(err);
            console.log('The file has been saved!');
        });
    })
}