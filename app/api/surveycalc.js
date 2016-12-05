const request = require('superagent');

/**
 * api url
 *
 * @type {string}
 */
const URL_BASE = 'http://vldb.gsi.go.jp/sokuchi/surveycalc/surveycalc/bl2st_calc.pl';

/**
 * outputType
 *
 * @type {string}
 */
const JSON = 'json';

/**
 * outputType
 *
 * @type {string}
 */
const XML = 'xml';

/**
 * ellipsoid
 *
 * @type {string}
 */
const GRS80 = 'GRS80';

/**
 * ellipsoid
 *
 * @type {string}
 */
const BESSEL = 'bessel';

/**
 * URL生成
 *
 * @param {number} lat1 latitude start
 * @param {number} lng1 longitude start
 * @param {number} lat2 latitude end
 * @param {number} lng2 longitude end
 * @param {string} output outputType
 * @param {string} ellipsoid ellipsoid
 *
 * @return {string} api url
 */
const buildUrl = (lat1, lng1, lat2, lng2, output = JSON, ellipsoid = GRS80) =>
  `${URL_BASE}?latitude1=${lat1}&longitude1=${lng1}&latitude2=${lat2}&longitude2=${lng2}&outputType=${output}&ellipsoid=${ellipsoid}`;


/**
 * 2点間の距離と方位角を取得（測量計算サイトのAPIを使用）
 *
 * @param {number} lat1 latitude start
 * @param {number} lng1 longitude start
 * @param {number} lat2 latitude end
 * @param {number} lng2 longitude end
 *
 * @return {Promise.<object>} promise instance
 */
exports.fetchDistAndAzimuth = (lat1, lng1, lat2, lng2) =>
  new Promise((resolve, reject) => {
    request
      .get(buildUrl(lat1, lng1, lat2, lng2))
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }
        const body = global.JSON.parse(res.text);
        if (!body.OutputData) {
          reject(body);
          return;
        }
        resolve(body.OutputData);
      });
  });
