/**
 * 扁平率（GRS80）
 *
 * @type {number}
 */
const f = 1 / 298.257222101;

/**
 * 長半径（GRS80）
 *
 * @type {number}
 */
const maxKm = 6378137;

/**
 * 短半径（GRS80）
 *
 * @type {number}
 */
const minKm = (1 - f) * maxKm;

exports.f = f;
exports.maxKm = maxKm;
exports.minKm = minKm;
