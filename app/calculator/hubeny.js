const radius = require('./../constant/radius');
const converter = require('./converter');

/**
 * 長半径
 *
 * @type {number}
 */
const a = radius.maxKm;

/**
 * 短半径
 *
 * @type {number}
 */
const b = radius.minKm;

/**
 * 第一離心率
 *
 * @type {number}
 */
const e = Math.sqrt(
  (Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(a, 2)
);

/**
 * 2点間の距離を計算（ヒュベニの公式）
 *
 * [参考サイト]
 * 二地点の緯度・経度からその距離を計算する
 * http://yamadarake.jp/trdi/report000001.html
 *
 * @param {number} lat1 latitude start
 * @param {number} lng1 longitude start
 * @param {number} lat2 latitude end
 * @param {number} lng2 longitude end
 *
 * @return {number} distance between two points(m)
 */
exports.dist = (lat1, lng1, lat2, lng2) => {
  const x1 = converter.toRad(lat1);
  const y1 = converter.toRad(lng1);
  const x2 = converter.toRad(lat2);
  const y2 = converter.toRad(lng2);

  const dY = y1 - y2;
  const dX = x1 - x2;
  const myY = (x1 + x2) / 2;

  const W = Math.sqrt(1 - (Math.pow(e, 2) * Math.pow(Math.sin(myY), 2)));
  const N = a / W;
  const M = (a * (1 - Math.pow(e, 2))) / Math.pow(W, 3);

  return Math.sqrt(
    Math.pow(dX * M, 2) + Math.pow(dY * N * Math.cos(myY), 2)
  );
};
