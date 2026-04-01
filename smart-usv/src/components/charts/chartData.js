export const modelNames = ['CNN', 'Transformer', 'MLP', 'LSTM', 'BiLSTM']

export const scenarios = ['Main', 'A1', 'A2', 'B1', 'B2']

// (a) DOB Residual Reduction — Surge (u-channel)
// 负值 = 残差降低（改善），正值 = 残差升高
export const barSurgeU = {
  CNN:         [  3.56,  19.45, -61.10, -61.37,  -2.80],
  Transformer: [ -3.01,  18.36, -63.84, -63.84,  -5.20],
  MLP:         [-18.36,  16.44, -84.93, -75.89, -12.40],
  LSTM:        [-17.53,  16.71, -75.62, -75.62, -10.80],
  BiLSTM:      [  2.47,  15.89, -59.73, -59.45,  -1.60],
}

// (b) DOB Residual Reduction — Yaw (r-channel)
export const barYawR = {
  CNN:         [13.2, 14.8, 20.1, 11.4,  8.6],
  Transformer: [14.5, 15.3, 18.7,  9.2, 16.1],
  MLP:         [12.1,  8.7, 17.4,  8.3, 13.2],
  LSTM:        [10.3,  7.2, 16.8, 12.1, 12.4],
  BiLSTM:      [ 9.1,  6.4,  4.2, 10.3,  8.7],
}

// (c) 散点图：参数量 (K) vs CPU 推理延迟 (μs)
export const scatterTradeOff = {
  CNN:         [[260, 1050], [220, 6350]],
  Transformer: [[ 70,  130]],
  MLP:         [[290,   48]],
  LSTM:        [[250, 4020], [160, 1020]],
  BiLSTM:      [[150, 1650], [120,  820]],
}

// (d) 相关系数热力图 Pearson ρ
// data: [xIndex, yIndex, value]
export const correlationHeatmapData = [
  [0, 0, 0.557], [1, 0, 0.499], [2, 0, 0.559], [3, 0, 0.453], [4, 0, 0.468],
  [0, 1, 0.581], [1, 1, 0.593], [2, 1, 0.629], [3, 1, 0.557], [4, 1, 0.559],
]

export const yLabelsD = ['Surge (u-channel)', 'Yaw (r-channel)']

export const modelColorMap = {
  CNN:         '#2f73ff',
  Transformer: '#2ca02c',
  MLP:         '#e377c2',
  LSTM:        '#ff7f0e',
  BiLSTM:      '#9467bd',
}

