const Table = require('cli-table');
const surveycalc = require('./../../app/api/surveycalc');
const cricular = require('./../../app/calculator/cricular');
const hubeny = require('./../../app/calculator/hubeny');
const vincenty = require('./../../app/calculator/vincenty');
const latlng = require('./../latlng');

/**
 * 小数点${n}桁以下を四捨五入
 *
 * @param {number} num number
 * @param {number} digit digit
 *
 * @return {number} formatted number
 */
const floatFormat = (num, digit) => {
  const pow = Math.pow(10, digit);
  return Math.round(num * pow) / pow;
};

/**
 * 試行回数
 *
 * @type {number}
 */
const trialNumber = 10;

/**
 * column name
 *
 * @type {string}
 */
const START_POINT = 'start point(°)';

/**
 * column name
 *
 * @type {string}
 */
const END_POINT = 'end point(°)';

/**
 * column name
 *
 * @type {string}
 */
const CRICULAR_DIST = 'cricular dist(m)';

/**
 * column name
 *
 * @type {string}
 */
const HUBENY_DIST = 'hubeny dist(m)';

/**
 * column name
 *
 * @type {string}
 */
const VINCENTY_DIST = 'vincenty dist(m)';

/**
 * column name
 *
 * @type {string}
 */
const API_DIST = 'api dist(m)';

/**
 * column name
 *
 * @type {string}
 */
const CRICULAR_DIFF = 'cricular diff(m)';

/**
 * column name
 *
 * @type {string}
 */
const HUBENY_DIFF = 'hubeny diff(m)';

/**
 * column name
 *
 * @type {string}
 */
const VINCENTY_DIFF = 'vincenty diff(m)';

/**
 * 座標リスト
 *
 * @type {Array}
 */
const points = latlng.randomLatLngList(trialNumber);

Promise
  .all(points.map(point => surveycalc.fetchDistAndAzimuth(...point)))
  .then((res) => {
    // 並び順はrowオブジェクトの順で保証
    const row = {
      [START_POINT]: '',
      [END_POINT]: '',
      [CRICULAR_DIST]: '',
      [HUBENY_DIST]: '',
      [VINCENTY_DIST]: '',
      [API_DIST]: '',
      [CRICULAR_DIFF]: '',
      [HUBENY_DIFF]: '',
      [VINCENTY_DIFF]: '',
    };

    const table = new Table({
      head: Object.keys(row),
      colWidths: [18, 18, 18, 18, 18, 18, 18, 18, 18],
    });

    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      const startLat = point[0];
      const startLng = point[1];
      const endLat = point[2];
      const endLng = point[3];

      const startPoint = [startLat, startLng];
      const endPoint = [endLat, endLng];

      const cricularDist = cricular.dist(...point);
      const hubenyDist = hubeny.dist(...point);
      const vincentyDist = vincenty.dist(...point);

      const apiDist = Number(res[i].geoLength);

      const cricularDiff = Math.abs(apiDist - cricularDist);
      const hubenyDiff = Math.abs(apiDist - hubenyDist);
      const vincentyDiff = Math.abs(apiDist - vincentyDist);

      row[START_POINT] = startPoint.join('\n');
      row[END_POINT] = endPoint.join('\n');
      row[CRICULAR_DIST] = floatFormat(cricularDist, 3).toLocaleString();
      row[HUBENY_DIST] = floatFormat(hubenyDist, 3).toLocaleString();
      row[VINCENTY_DIST] = floatFormat(vincentyDist, 3).toLocaleString();
      row[API_DIST] = floatFormat(apiDist, 3).toLocaleString();
      row[CRICULAR_DIFF] = floatFormat(cricularDiff, 3).toLocaleString();
      row[HUBENY_DIFF] = floatFormat(hubenyDiff, 3).toLocaleString();
      row[VINCENTY_DIFF] = floatFormat(vincentyDiff, 3).toLocaleString();

      table.push(Object.values(row));
    }

    console.log(table.toString());
  })
  .catch(console.error);
