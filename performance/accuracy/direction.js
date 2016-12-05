const Table = require('cli-table');
const surveycalc = require('./../../app/api/surveycalc');
const vincenty = require('./../../app/calculator/vincenty');
const latlng = require('./../latlng');

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
const VINCENTY_DIRECTION = 'vincenty direction(°)';

/**
 * column name
 *
 * @type {string}
 */
const API_DIRECTION = 'api direction(°)';

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
      [VINCENTY_DIRECTION]: '',
      [API_DIRECTION]: '',
    };

    const table = new Table({
      head: Object.keys(row),
      colWidths: [25, 25, 25, 25],
    });

    for (let i = 0; i < trialNumber; i++) {
      const point = points[i];
      const startLat = point[0];
      const startLng = point[1];
      const endLat = point[2];
      const endLng = point[3];

      const startPoint = [startLat, startLng];
      const endPoint = [endLat, endLng];

      const vincentyDirection = [
        vincenty.direction(...point).azimuth1,
        vincenty.direction(...point).azimuth2,
      ];

      const apiDirection = [
        Number(res[i].azimuth1),
        Number(res[i].azimuth2),
      ];

      row[START_POINT] = startPoint.join('\n');
      row[END_POINT] = endPoint.join('\n');
      row[VINCENTY_DIRECTION] = vincentyDirection.join('\n');
      row[API_DIRECTION] = apiDirection.join('\n');

      table.push(Object.values(row));
    }

    console.log(table.toString());
  })
  .catch(console.error);
