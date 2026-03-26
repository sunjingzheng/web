export const modelNames = ['CNN', 'Transformer', 'MLP', 'LSTM', 'BiLSTM']

export const scenarios = ['Main', 'A1', 'A2', 'B1', 'B2']

// 假数据：按你截图的视觉风格先填充，后续你替换成真实数值即可
export const barSurgeU = {
  // (a) DOB Residual Reduction — Surge (u-channel)
  // 这组假数据用于让柱高与截图中的 (a) 表A 完全对齐展示。
  CNN: [3.5616438356164366, 19.45205479452055, -61.0958904109589, -61.369863013698634, 0.0],
  Transformer: [-3.013698630136986, 18.356164383561644, -63.83561643835617, -63.83561643835617, 0.0],
  MLP: [-18.35616438356164, 16.438356164383563, -84.93150684931507, -75.89041095890411, 0.0],
  LSTM: [-17.534246575342465, 16.71232876712329, -75.61643835616438, -75.61643835616438, 0.0],
  BiLSTM: [2.465753424657535, 15.89041095890411, -59.72602739726027, -59.45205479452055, 0.0],
}

export const barYawR = {
  CNN: [13, 14, 20, 11, 8],
  Transformer: [14, 15, 18, 9, 16],
  MLP: [12, 8.5, 17, 8, 13],
  LSTM: [10, 7, 16.5, 12, 12],
  BiLSTM: [9, 6, 4, 10, 8.5],
}

// (c) 散点图 yAxis 使用 type: 'log'，需要提供真实数值（约落在 10^2~10^4）
export const scatterTradeOff = {
  CNN: [
    [260, 1000],
    [220, 6300],
  ],
  Transformer: [[70, 126]],
  MLP: [[290, 45]],
  LSTM: [
    [250, 3980],
    [160, 1000],
  ],
  BiLSTM: [
    [150, 1600],
    [120, 800],
  ],
}

// (d) 相关系数热力图 Pearson ρ（从你给的图中可读数值）
// data: [xIndex, yIndex, value]
export const correlationHeatmapData = [
  // Surge (u-channel)
  [0, 0, 0.557],
  [1, 0, 0.499],
  [2, 0, 0.559],
  [3, 0, 0.453],
  [4, 0, 0.468],
  // Yaw (r-channel)
  [0, 1, 0.581],
  [1, 1, 0.593],
  [2, 1, 0.629],
  [3, 1, 0.557],
  [4, 1, 0.559],
]

export const yLabelsD = ['Surge (u-channel)', 'Yaw (r-channel)']

export const modelColorMap = {
  CNN: '#2f7ed8',
  Transformer: '#2ca02c',
  MLP: '#e377c2',
  LSTM: '#ff7f0e',
  BiLSTM: '#9467bd',
}

