const radius = require('./../constant/radius');
const converter = require('./converter');

/**
 * 2点間の距離を計算（大円距離）
 *
 * [参考サイト]
 * 緯度経度を用いた3つの距離計算方法
 * http://www.orsj.or.jp/archive2/or60-12/or60_12_701.pdf
 *
 * @param {number} lat1 latitude start
 * @param {number} lng1 longitude start
 * @param {number} lat2 latitude end
 * @param {number} lng2 longitude end
 *
 * @return {number} distance between two points(m)
 */
exports.dist = (lat1, lng1, lat2, lng2) => {
  const radLat1 = converter.toRad(lat1);
  const radLng1 = converter.toRad(lng1);
  const radLat2 = converter.toRad(lat2);
  const radLng2 = converter.toRad(lng2);

  return radius.maxKm * Math.acos(
      (Math.sin(radLat1) * Math.sin(radLat2)) +
      (Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radLng1 - radLng2))
    );
};

