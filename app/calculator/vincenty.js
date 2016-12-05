const radius = require('./../constant/radius');
const converter = require('./converter');

/**
 * 長軸半径 (赤道半径)
 *
 * @type {number}
 */
const a = radius.maxKm;

/**
 * 短軸半径 (極半径)
 *
 * @type {number}
 */
const b = radius.minKm;

/**
 * 扁平率
 *
 * @type {number}
 */
const f = radius.f;

/**
 * 2点間の距離を計算（Vincenty法）
 *
 * [参考サイト]
 * 緯度、経度への換算
 * http://vldb.gsi.go.jp/sokuchi/surveycalc/surveycalc/xy2blf.html
 *
 * Vincenty法
 * https://ja.wikipedia.org/wiki/Vincenty%E6%B3%95
 *
 * @param {number} lat1 latitude start
 * @param {number} lng1 longitude start
 * @param {number} lat2 latitude end
 * @param {number} lng2 longitude end
 *
 * @return {number} distance between two points(m)
 */
exports.dist = (lat1, lng1, lat2, lng2) => {
  const phi1 = converter.toRad(lat1);
  const phi2 = converter.toRad(lat2);

  const U1 = Math.atan((1 - f) * Math.tan(phi1));
  const U2 = Math.atan((1 - f) * Math.tan(phi2));


  const L = converter.toRad(lng2 - lng1);

  const sinU1 = Math.sin(U1);
  const cosU1 = Math.cos(U1);
  const cosU2 = Math.cos(U2);
  const sinU2 = Math.sin(U2);

  let lambda = L;
  let lambdaPrev;
  let sinLambda;
  let cosLambda;
  let sinSigma;
  let cosSigma;
  let sigma;
  let cosSqAlpha;
  let cos2SigmaM;

  let limit = 1000;

  do {
    sinLambda = Math.sin(lambda);
    cosLambda = Math.cos(lambda);

    sinSigma = Math.sqrt(
      Math.pow(cosU2 * sinLambda, 2) +
      Math.pow((cosU1 * sinU2) - (sinU1 * cosU2 * cosLambda), 2)
    );

    cosSigma = (sinU1 * sinU2) + (cosU1 * cosU2 * cosLambda);
    sigma = Math.atan2(sinSigma, cosSigma);

    const sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
    cosSqAlpha = 1 - Math.pow(sinAlpha, 2);

    cos2SigmaM = Math.cos(sigma) - ((2 * sinU1 * sinU2) / cosSqAlpha);

    const C = (f / 16) * cosSqAlpha * (4 + (f * (4 - (3 * cosSqAlpha))));

    lambdaPrev = lambda;

    lambda = L +
      ((1 - C) * f * sinAlpha *
        (sigma + (C * sinSigma *
          (cos2SigmaM + (C * cosSigma * (-1 + (2 * Math.pow(cos2SigmaM, 2)))))
        ))
      );
  } while (Math.abs(lambda - lambdaPrev) > Math.pow(10, -15) && --limit > 0);

  const uSq = cosSqAlpha * ((Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(b, 2));
  const A = 1 + ((uSq / 16384) * (4096 + (uSq * (-768 + (uSq * (320 - (175 * uSq)))))));
  const B = (uSq / 1024) * (256 + (uSq * (-128 * uSq * (74 - (47 * uSq)))));
  const deltaSigma = B * sinSigma * (
      cos2SigmaM +
      (B / 4 * (cosSigma * (-1 + 2 * Math.pow(cos2SigmaM, 2)))) -
      (B / 6 * cos2SigmaM * (-3 + 4 * Math.pow(sinSigma, 2)) * (-3 + 4 * Math.pow(cos2SigmaM, 2)))
    );

  return b * A * (sigma - deltaSigma);
};

/**
 * 2点間の方位角を計算（Vincenty法）
 *
 * [参考サイト]
 * 緯度、経度への換算
 * http://vldb.gsi.go.jp/sokuchi/surveycalc/surveycalc/xy2blf.html
 *
 * Vincenty法
 * https://ja.wikipedia.org/wiki/Vincenty%E6%B3%95
 *
 * @param {number} lat1 latitude start
 * @param {number} lng1 longitude start
 * @param {number} lat2 latitude end
 * @param {number} lng2 longitude end
 *
 * @return {object.<number, number>} azimuth between two points
 */
exports.direction = (lat1, lng1, lat2, lng2) => {
  const phi1 = converter.toRad(lat1);
  const phi2 = converter.toRad(lat2);

  const U1 = Math.atan((1 - f) * Math.tan(phi1));
  const U2 = Math.atan((1 - f) * Math.tan(phi2));


  const L = converter.toRad(lng2 - lng1);

  const sinU1 = Math.sin(U1);
  const cosU1 = Math.cos(U1);
  const cosU2 = Math.cos(U2);
  const sinU2 = Math.sin(U2);

  let lambda = L;
  let lambdaPrev;
  let sinLambda;
  let cosLambda;
  let sinSigma;
  let cosSigma;
  let sigma;
  let cosSqAlpha;
  let cos2SigmaM;

  let limit = 100;

  do {
    sinLambda = Math.sin(lambda);
    cosLambda = Math.cos(lambda);

    sinSigma = Math.sqrt(
      Math.pow(cosU2 * sinLambda, 2) +
      Math.pow((cosU1 * sinU2) - (sinU1 * cosU2 * cosLambda), 2)
    );

    cosSigma = (sinU1 * sinU2) + (cosU1 * cosU2 * cosLambda);
    sigma = Math.atan2(sinSigma, cosSigma);

    const sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
    cosSqAlpha = 1 - Math.pow(sinAlpha, 2);

    cos2SigmaM = Math.cos(sigma) - ((2 * sinU1 * sinU2) / cosSqAlpha);

    const C = (f / 16) * cosSqAlpha * (4 + (f * (4 - (3 * cosSqAlpha))));

    lambdaPrev = lambda;

    lambda = L +
      ((1 - C) * f * sinAlpha *
        (sigma + (C * sinSigma *
          (cos2SigmaM + (C * cosSigma * (-1 + (2 * Math.pow(cos2SigmaM, 2)))))
        ))
      );
  } while (Math.abs(lambda - lambdaPrev) > Math.pow(10, -15) && --limit > 0);

  const azimuth1 = converter.toDeg(
    Math.atan2(cosU2 * sinLambda, cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
  );
  const azimuth2 = converter.toDeg(
    Math.atan2(cosU1 * sinLambda, -1 * sinU1 * cosU2 + cosU1 * sinU2 * cosLambda) + Math.PI // 向き反転
  );

  return {
    azimuth1: azimuth1 < 0 ? azimuth1 + 360 : azimuth1,
    azimuth2: azimuth2 < 0 ? azimuth2 + 360 : azimuth2,
  };
};
