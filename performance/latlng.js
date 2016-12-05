/**
 * 緯度の最大値
 * @todo 有効範囲が決まっている？？
 *
 * @type {number}
 */
const latMax = 85; //

/**
 * 経度の最大値
 *
 * @type {number}
 */
const lngMax = 180;

/**
 * ランダムな緯度を生成
 *
 * @return {number} latitude
 */
const randomLat = () => Math.random() * latMax * (Math.floor(Math.random() * 2) || -1);

/**
 * ランダムな経度を生成
 *
 * @return {number} longitude
 */
const randomLng = () => Math.random() * lngMax * (Math.floor(Math.random() * 2) || -1);

/**
 * ランダムな座標を生成
 *
 * @return {Array} [latitude, longitude,]
 */
const randomLatLng = () => [randomLat(), randomLng()];

/**
 * ランダムな座標のリストを生成
 *
 * @param {number} count number of list
 * @return {Array} [latitude1, longitude1, latitude2, longitude2,]
 */
const randomLatLngList = (count) => {
  const ret = [];
  for (let i = 0; i < count; i++) {
    const startPoint = randomLatLng();
    const endPoint = randomLatLng();
    ret.push(startPoint.concat(endPoint));
  }
  return ret;
};

exports.randomLatLngList = randomLatLngList;
