# geo-distance-azimuth
calculate distance and azimuth between two points.

## 手順
```
# install
npm install  
```

## 開発 / テスト環境
<dl>
  <dt>言語</dt>
  <dd>JavaScript</dd>
  <dt>環境</dt>
  <dd>Node.js (v7.2.0)</dd>
  <dt>OS</dt>
  <dd>macOS Sierra (v10.12.1)</dd>
</dl>

## 2点間の直線距離
計算方法は下記のサイトを参考  
計算にはGRS80を使用

[緯度経度を用いた3つの距離計算方法](http://www.orsj.or.jp/archive2/or60-12/or60_12_701.pdf)

### 第1の方法：地球を球と仮定する
```
# file
app/calculator/cricular.js
```

### 第2の方法：回転楕円体を仮定した測地線距離の計算
```
# file
app/calculator/vincenty.js
```
[経緯度を用いた2地点間の測地線長、方位角を求める計算](http://vldb.gsi.go.jp/sokuchi/surveycalc/surveycalc/algorithm/bl2st/bl2st.htm)
は複雑過ぎたため、[Vincenty法](https://ja.wikipedia.org/wiki/Vincenty%E6%B3%95)
にて実装

### 第3の方法：ヒュベニイの平均経度の式
```
# file
app/calculator/hubeny.js
```

## 2点間の方位角
計算方法は下記のサイトを参考  
計算にはGRS80を使用

[緯度、経度への換算](http://vldb.gsi.go.jp/sokuchi/surveycalc/surveycalc/xy2blf.html)

```
# file
app/calculator/vincenty.js
```

## パフォーマンス計測
距離、方位角それぞれについてパフォーマンスを測定

### 速度
距離のみそれぞれの方法での計算時間と速度を比較し、コンソールにテーブル出力

```
# ランダムに生成した100,000地点間の距離を計算
# 計算に要した
# - 合計時間
# - 1msあたりの計算回数
# をテーブル主力
npm run-script speed-dist
```
ヒュベニの公式がもっと速く、Vincenty法がもっとも遅い

### 精度
距離、方位角ともにそれぞれの方法で計算し、国土地理院のAPIから取得した値と比較  
計算結果とAPI値との差をコンソールにテーブル出力
```
# -------------------------------------------
# 距離
# -------------------------------------------
# ランダムに生成した10地点間の距離を計算
# 国土地理院のAPIから10地点間の距離を取得
# 距離の一覧とAPI値との差をコンソールにテーブル出力
npm run-script accuracy-dist

# -------------------------------------------
# 方位角
# -------------------------------------------
# ランダムに生成した10地点間の方位角を計算
# 国土地理院のAPIから10地点間の方位角を取得
# 方位角の一覧をコンソールにテーブル出力
npm run-script accuracy-direction
```
精度はVincenty法がもっと高く誤差は0.001%以下  
地球を球と仮定した方法は常に誤差0.5%以下あるのに対し、ヒュベニの公式は場所によっては50%を超えた
