/**
 * Self-contained, 100% offline QR Code Generator in pure TypeScript.
 * No external npm packages or internet connections required.
 * Based on ISO/IEC 18004 standard QR Code specification.
 */

// Galois Field GF(256) math tables
const EXP_TABLE = new Uint8Array(256)
const LOG_TABLE = new Uint8Array(256)

for (let i = 0, x = 1; i < 256; i++) {
  EXP_TABLE[i] = x
  LOG_TABLE[x] = i
  x = (x << 1) ^ (x >= 128 ? 0x11d : 0)
}

function glog(n: number): number {
  if (n < 1) throw new Error(`glog(${n}) error`)
  return LOG_TABLE[n]
}

function gexp(n: number): number {
  while (n < 0) n += 255
  while (n >= 256) n -= 255
  return EXP_TABLE[n]
}

class Polynomial {
  num: number[]
  constructor(num: number[], shift = 0) {
    let offset = 0
    while (offset < num.length && num[offset] === 0) offset++
    this.num = new Array(num.length - offset + shift).fill(0)
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[offset + i]
    }
  }

  get(index: number): number {
    return this.num[index]
  }

  getLength(): number {
    return this.num.length
  }

  multiply(e: Polynomial): Polynomial {
    const num = new Array(this.getLength() + e.getLength() - 1).fill(0)
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= gexp(glog(this.get(i)) + glog(e.get(j)))
      }
    }
    return new Polynomial(num)
  }

  mod(e: Polynomial): Polynomial {
    if (this.getLength() - e.getLength() < 0) return this
    const ratio = glog(this.get(0)) - glog(e.get(0))
    const num = new Array(this.getLength()).fill(0)
    for (let i = 0; i < this.getLength(); i++) {
      num[i] = this.get(i)
    }
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= gexp(glog(e.get(i)) + ratio)
    }
    return new Polynomial(num).mod(e)
  }
}

class RSBlock {
  totalCount: number
  dataCount: number
  constructor(totalCount: number, dataCount: number) {
    this.totalCount = totalCount
    this.dataCount = dataCount
  }

  static getRSBlocks(typeNumber: number, errorCorrectionLevel: number): RSBlock[] {
    const rsBlock = RS_BLOCK_TABLE[(typeNumber - 1) * 4 + errorCorrectionLevel]
    if (!rsBlock) throw new Error(`Bad RS block: type=${typeNumber}, level=${errorCorrectionLevel}`)
    const list: RSBlock[] = []
    for (let i = 0; i < rsBlock.length; i += 2) {
      const count = rsBlock[i]
      const totalCount = rsBlock[i + 1]
      const dataCount = totalCount - RS_ECC_TABLE[(typeNumber - 1) * 4 + errorCorrectionLevel]
      for (let j = 0; j < count; j++) {
        list.push(new RSBlock(totalCount, dataCount))
      }
    }
    return list
  }
}

// Table of RS Blocks per version (1-10) and EC Level (0=M, 1=L, 2=H, 3=Q)
const RS_ECC_TABLE = [
  10, 7, 17, 13, 16, 10, 28, 22, 26, 15, 44, 36, 18, 20, 32, 26, 24, 26, 40, 36, 16, 26, 48, 40,
  18, 30, 42, 36, 22, 32, 46, 42, 22, 36, 52, 46, 26, 40, 56, 50,
]

const RS_BLOCK_TABLE: number[][] = [
  [1, 26], [1, 26], [1, 26], [1, 26], // 1
  [1, 44], [1, 44], [1, 44], [1, 44], // 2
  [1, 70], [1, 70], [2, 35], [2, 35], // 3
  [2, 50], [1, 100], [4, 25], [2, 50], // 4
  [2, 67], [1, 134], [4, 33], [2, 67], // 5
  [4, 43], [2, 86], [4, 43], [4, 43], // 6
  [4, 49], [2, 98], [5, 39], [6, 39], // 7
  [4, 60], [2, 121], [6, 40], [6, 40], // 8
  [5, 58], [2, 146], [8, 36], [8, 40], // 9
  [5, 69], [4, 86], [8, 43], [8, 43], // 10
]

const PATTERN_POSITION_TABLE: number[][] = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
]

class BitBuffer {
  buffer: number[] = []
  length = 0

  get(index: number): boolean {
    const bufIndex = Math.floor(index / 8)
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1
  }

  put(num: number, length: number) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1)
    }
  }

  putBit(bit: boolean) {
    const bufIndex = Math.floor(this.length / 8)
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0)
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8)
    }
    this.length++
  }
}

export class QRCodeModel {
  typeNumber: number
  errorCorrectLevel: number
  modules: (boolean | null)[][] = []
  moduleCount = 0
  dataCache: number[] | null = null
  dataList: { data: string }[] = []

  constructor(typeNumber: number, errorCorrectLevel: number) {
    this.typeNumber = typeNumber
    this.errorCorrectLevel = errorCorrectLevel
  }

  addData(data: string) {
    this.dataList.push({ data })
    this.dataCache = null
  }

  isDark(row: number, col: number): boolean {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      return false
    }
    return this.modules[row][col] === true
  }

  getModuleCount(): number {
    return this.moduleCount
  }

  make() {
    this.makeImpl(false, this.getBestMaskPattern())
  }

  private makeImpl(test: boolean, maskPattern: number) {
    this.moduleCount = this.typeNumber * 4 + 17
    this.modules = new Array(this.moduleCount)
    for (let row = 0; row < this.moduleCount; row++) {
      this.modules[row] = new Array(this.moduleCount).fill(null)
    }

    this.setupPositionProbePattern(0, 0)
    this.setupPositionProbePattern(this.moduleCount - 7, 0)
    this.setupPositionProbePattern(0, this.moduleCount - 7)
    this.setupPositionAdjustPattern()
    this.setupTimingPattern()
    this.setupTypeInfo(test, maskPattern)

    if (this.dataCache == null) {
      this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)
    }

    this.mapData(this.dataCache, maskPattern)
  }

  private setupPositionProbePattern(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this.modules[row + r][col + c] = true
        } else {
          this.modules[row + r][col + c] = false
        }
      }
    }
  }

  private setupTimingPattern() {
    for (let i = 8; i < this.moduleCount - 8; i++) {
      if (this.modules[i][6] === null) {
        this.modules[i][6] = i % 2 === 0
      }
      if (this.modules[6][i] === null) {
        this.modules[6][i] = i % 2 === 0
      }
    }
  }

  private setupPositionAdjustPattern() {
    const pos = PATTERN_POSITION_TABLE[this.typeNumber - 1] || []
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i]
        const col = pos[j]
        if (this.modules[row][col] != null) continue
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
              this.modules[row + r][col + c] = true
            } else {
              this.modules[row + r][col + c] = false
            }
          }
        }
      }
    }
  }

  private setupTypeInfo(test: boolean, maskPattern: number) {
    const data = (this.errorCorrectLevel << 3) | maskPattern
    const bits = getBCHTypeInfo(data)
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      if (i < 6) {
        this.modules[i][8] = mod
      } else if (i < 8) {
        this.modules[i + 1][8] = mod
      } else {
        this.modules[this.moduleCount - 15 + i][8] = mod
      }
    }
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      if (i < 8) {
        this.modules[8][this.moduleCount - i - 1] = mod
      } else if (i < 9) {
        this.modules[8][15 - i - 1 + 1] = mod
      } else {
        this.modules[8][15 - i - 1] = mod
      }
    }
    this.modules[this.moduleCount - 8][8] = !test
  }

  private mapData(data: number[], maskPattern: number) {
    let inc = -1
    let row = this.moduleCount - 1
    let bitIndex = 7
    let byteIndex = 0

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] === null) {
            let dark = false
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1
            }
            const mask = getMask(maskPattern, row, col - c)
            if (mask) dark = !dark
            this.modules[row][col - c] = dark
            bitIndex--
            if (bitIndex === -1) {
              byteIndex++
              bitIndex = 7
            }
          }
        }
        row += inc
        if (row < 0 || this.moduleCount <= row) {
          row -= inc
          inc = -inc
          break
        }
      }
    }
  }

  private getBestMaskPattern(): number {
    let minLostPoint = 0
    let pattern = 0
    for (let i = 0; i < 8; i++) {
      this.makeImpl(true, i)
      const lostPoint = getLostPoint(this)
      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint
        pattern = i
      }
    }
    return pattern
  }

  private static createData(
    typeNumber: number,
    errorCorrectLevel: number,
    dataList: { data: string }[]
  ): number[] {
    const rsBlocks = RSBlock.getRSBlocks(typeNumber, errorCorrectLevel)
    const buffer = new BitBuffer()

    for (const d of dataList) {
      buffer.put(4, 4) // 8-bit byte mode
      buffer.put(d.data.length, typeNumber < 10 ? 8 : 16)
      for (let i = 0; i < d.data.length; i++) {
        buffer.put(d.data.charCodeAt(i), 8)
      }
    }

    let totalDataCount = 0
    for (const b of rsBlocks) totalDataCount += b.dataCount

    if (buffer.length + 4 <= totalDataCount * 8) {
      buffer.put(0, 4)
    }

    while (buffer.length % 8 !== 0) {
      buffer.putBit(false)
    }

    while (true) {
      if (buffer.length >= totalDataCount * 8) break
      buffer.put(0xec, 8)
      if (buffer.length >= totalDataCount * 8) break
      buffer.put(0x11, 8)
    }

    return createBytes(buffer, rsBlocks)
  }
}

function createBytes(buffer: BitBuffer, rsBlocks: RSBlock[]): number[] {
  let offset = 0
  let maxDcCount = 0
  let maxEcCount = 0
  const dcdata = new Array(rsBlocks.length)
  const ecdata = new Array(rsBlocks.length)

  for (let r = 0; r < rsBlocks.length; r++) {
    const dcCount = rsBlocks[r].dataCount
    const ecCount = rsBlocks[r].totalCount - dcCount
    maxDcCount = Math.max(maxDcCount, dcCount)
    maxEcCount = Math.max(maxEcCount, ecCount)
    dcdata[r] = new Array(dcCount)
    for (let i = 0; i < dcdata[r].length; i++) {
      dcdata[r][i] = 0xff & buffer.buffer[i + offset]
    }
    offset += dcCount

    const rsPoly = getErrorCorrectPolynomial(ecCount)
    const rawPoly = new Polynomial(dcdata[r], rsPoly.getLength() - 1)
    const modPoly = rawPoly.mod(rsPoly)
    ecdata[r] = new Array(rsPoly.getLength() - 1)
    for (let i = 0; i < ecdata[r].length; i++) {
      const modIndex = i + modPoly.getLength() - ecdata[r].length
      ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0
    }
  }

  let totalCodeCount = 0
  for (const b of rsBlocks) totalCodeCount += b.totalCount
  const data = new Array(totalCodeCount)
  let index = 0

  for (let i = 0; i < maxDcCount; i++) {
    for (let r = 0; r < rsBlocks.length; r++) {
      if (i < dcdata[r].length) data[index++] = dcdata[r][i]
    }
  }

  for (let i = 0; i < maxEcCount; i++) {
    for (let r = 0; r < rsBlocks.length; r++) {
      if (i < ecdata[r].length) data[index++] = ecdata[r][i]
    }
  }

  return data
}

function getErrorCorrectPolynomial(errorCorrectLength: number): Polynomial {
  let a = new Polynomial([1], 0)
  for (let i = 0; i < errorCorrectLength; i++) {
    a = a.multiply(new Polynomial([1, gexp(i)], 0))
  }
  return a
}

function getBCHTypeInfo(data: number): number {
  let d = data << 10
  while (getBCHDigit(d) - getBCHDigit(1335) >= 0) {
    d ^= 1335 << (getBCHDigit(d) - getBCHDigit(1335))
  }
  return ((data << 10) | d) ^ 21522
}

function getBCHDigit(data: number): number {
  let digit = 0
  while (data !== 0) {
    digit++
    data >>>= 1
  }
  return digit
}

function getMask(maskPattern: number, i: number, j: number): boolean {
  switch (maskPattern) {
    case 0: return (i + j) % 2 === 0
    case 1: return i % 2 === 0
    case 2: return j % 3 === 0
    case 3: return (i + j) % 3 === 0
    case 4: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
    case 5: return ((i * j) % 2) + ((i * j) % 3) === 0
    case 6: return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0
    case 7: return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0
    default: return false
  }
}

function getLostPoint(qrCode: QRCodeModel): number {
  const moduleCount = qrCode.getModuleCount()
  let lostPoint = 0

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      let sameCount = 0
      const dark = qrCode.isDark(row, col)
      for (let r = -1; r <= 1; r++) {
        if (row + r < 0 || moduleCount <= row + r) continue
        for (let c = -1; c <= 1; c++) {
          if (col + c < 0 || moduleCount <= col + c) continue
          if (r === 0 && c === 0) continue
          if (dark === qrCode.isDark(row + r, col + c)) sameCount++
        }
      }
      if (sameCount > 5) lostPoint += 3 + sameCount - 5
    }
  }

  return lostPoint
}

/**
 * Generate a 2D boolean array representing the QR code matrix.
 * Chooses the minimal version that can hold the text.
 */
export function generateQRMatrix(text: string): boolean[][] {
  const len = text.length
  let version = 2
  if (len > 70) version = 7
  else if (len > 50) version = 5
  else if (len > 32) version = 4
  else if (len > 20) version = 3

  const qr = new QRCodeModel(version, 1) // level 1 = L (Low EC, maximum capacity)
  qr.addData(text)
  qr.make()

  const count = qr.getModuleCount()
  const matrix: boolean[][] = []
  for (let r = 0; r < count; r++) {
    const row: boolean[] = []
    for (let c = 0; c < count; c++) {
      row.push(qr.isDark(r, c))
    }
    matrix.push(row)
  }
  return matrix
}

