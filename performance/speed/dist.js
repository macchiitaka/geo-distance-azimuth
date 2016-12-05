const Table = require('cli-table');
const cricular = require('./../../app/calculator/cricular');
const hubeny = require('./../../app/calculator/hubeny');
const vincenty = require('./../../app/calculator/vincenty');
const latlng = require('./../latlng');

/**
 * 試行回数
 *
 * @type {number}
 */
const trialNumber = 100000;

/**
 * 座標リスト
 *
 * @type {Array}
 */
const points = latlng.randomLatLngList(trialNumber);

/**
 * 計測結果
 *
 * @type {Array}
 */
const results = [];

/**
 * 計測開始時刻
 *
 * @type {object}
 */
let startTime;

/**
 * 計測
 *
 * @param {function} method method
 *
 * @return {undefined}
 */
const timer = (method) => {
  startTime = new Date();
  points.map(point => method(...point));
  results.push(new Date() - startTime);
};

// 計測
timer(cricular.dist);
timer(hubeny.dist);
timer(vincenty.dist);

// 結果テーブル生成
const head = ['cricular', 'hubeny', 'vincenty'];
const colWidths = [20, 20, 20];

// 合計時間
const table1 = new Table({
  head: head.map(name => `${name}(ms)`),
  colWidths,
});
table1.push(results.map(result => result.toLocaleString()));

// 速度
const table2 = new Table({
  head: head.map(name => `${name}(cnt/ms)`),
  colWidths,
});
table2.push(results.map(result => trialNumber / (1000 * result)));

// 出力
console.log(`Number of trial: ${trialNumber.toLocaleString()}`);
console.log('Total time');
console.log(table1.toString());
console.log('Speed');
console.log(table2.toString());
