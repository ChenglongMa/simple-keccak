let b = 25; // configuration for CS assignment: Keccak-f[25]
let rounds = 12;
let w = b / 25;
let round = 0;

// Round constants
const RC =
    [
        0x0000000000000001,
        0x0000000000008082,
        0x800000000000808An,
        0x8000000080008000n,
        0x000000000000808B,
        0x0000000080000001,
        0x8000000080008081n,
        0x8000000000008009n,
        0x000000000000008A,
        0x0000000000000088,
        0x0000000080008009,
        0x000000008000000A,
        0x000000008000808B,
        0x800000000000008Bn,
        0x8000000000008089n,
        0x8000000000008003n,
        0x8000000000008002n,
        0x8000000000000080n,
        0x000000000000800A,
        0x800000008000000An,
        0x8000000080008081n,
        0x8000000000008080n,
        0x0000000080000001,
        0x8000000080008008n
    ];
// Rotation offsets
const r =
    [
        [0, 36, 3, 41, 18],
        [1, 44, 10, 45, 2],
        [62, 6, 43, 15, 61],
        [28, 55, 25, 21, 56],
        [27, 20, 39, 8, 14]
    ];

/**
 * Sets state of Keccak
 * @param l the number of lanes
 */
function setB(l) {
    w = Math.pow(2, l);
    b = 5 * 5 * w;
    rounds = 12 + 2 * l;
    document.getElementById('b').innerText = b;
}

/**
 * Gets the first bit of random constant.
 * @returns {number}
 */
function getRCBit() {
    const rc64bin = padding0(RC[round].toString(2), 64);
    return parseInt(rc64bin.substr(0, 1), 2);
}

/**
 * rotation operation
 * @param x
 * @param n value in r
 * @returns {number}
 */
function rot(x, n) {
    n %= w;
    return ((x >> (w - n)) + (x << n)) % (1 << w)
}

function setC() {
    for (let x = 0; x < 5; x++) {
        const id = x.toString() + 0;
        let c = document.getElementById(id).value;
        for (let y = 1; y < 5; y++) {
            const id = x.toString() + y;
            c ^= document.getElementById(id).value;
        }
        document.getElementById('c0' + x).value = c;
    }
}

function setD(x) {
    const c1m = document.getElementById('c0' + (x + 4) % 5).value;
    const c1p = document.getElementById('c0' + (x + 1) % 5).value;
    const d = c1m ^ rot(c1p, 1);
    document.getElementById('d0' + x).value = d;
    return d;
}

/**
 * The theta step
 */
function theta() {
    setC();
    for (let x = 0; x < 5; x++) {
        const d = setD(x);
        for (let y = 0; y < 5; y++) {
            const id = x.toString() + y;
            const originalVal = document.getElementById(id).value;
            document.getElementById(`a${id}`).value = originalVal ^ d;
            document.getElementById(`pi${id}`).value = originalVal ^ d;
        }
    }
    pi();
}

/**
 * The pi step
 */
function pi() {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            const id = 'pi' + x + y;
            const originalVal = document.getElementById(id).value;
            const newId = `${y}${(2 * x + 3 * y) % 5}`;
            const val = rot(originalVal, r[x][y]);
            document.getElementById('pib' + newId).value = val;
            document.getElementById('chi' + newId).value = val;
        }
    }
    chi();
}

/**
 * The chi step
 */
function chi() {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            const id = `${x}${y}`;
            const id1 = `chi${(x + 1) % 5}${y}`;
            const id2 = `chi${(x + 2) % 5}${y}`;
            const oriB = document.getElementById(`chi${id}`).value;
            const invB = document.getElementById(id1).value ^ 1;
            document.getElementById(`chii${id}`).value = invB;
            const oriB2 = document.getElementById(id2).value;
            document.getElementById(`chio${id}`).value = oriB2;
            const a = oriB ^ (invB & oriB2);
            document.getElementById(`chia${id}`).value = a;
            document.getElementById(`iota${id}`).value = a;
            document.getElementById(`final${id}`).value = a;
        }
    }
    iota();
}

/**
 * The iota step
 */
function iota() {
    const id = `iota00`;
    const fid = `final00`;
    document.getElementById(fid).value = document.getElementById(id).value ^ getRCBit();
    updateCSS();
}

/**
 * Updates the random constant
 */
function setRC() {
    const rc = RC[round];
    document.getElementById('rc').innerText = padding0(rc.toString(16), 16);
    document.getElementById('round').innerText = round.toString();
    document.getElementById('rcbit').innerText = getRCBit().toString();
}

/**
 * Executes the next round
 */
function nextRound() {
    round = (round + 1) % rounds;
    setRC();
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            const id = `${x}${y}`;
            document.getElementById(id).value = document.getElementById(`final${id}`).value;
        }
    }
    theta();
}
