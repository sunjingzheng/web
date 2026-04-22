export const modelNames = ['CNN', 'Transformer', 'MLP', 'LSTM', 'BiLSTM']

export const scenarios = ['Main', 'A1', 'A2', 'B1', 'B2']

// (a) DOB Residual Reduction — Surge (u-channel)
// 根据用户提供的数据计算残差减少率
export const barSurgeU = {
  CNN:         [3.56, 19.45, -61.10, -61.37, -2.80],
  Transformer: [-3.01, 18.36, -63.84, -63.84, -5.20],
  MLP:         [-18.36, 16.44, -84.93, -75.89, -12.40],
  LSTM:        [-17.53, 16.71, -75.62, -75.62, -10.80],
  BiLSTM:      [2.47, 15.89, -59.73, -59.45, -1.60],
}

// (b) DOB Residual Reduction — Yaw (r-channel)
export const barYawR = {
  CNN:         [13.3, 7.4, 14.1, 11.1, 6.5],
  Transformer: [15.1, 8.9, 13.7, 11.5, 9.0],
  MLP:         [15.6, 9.1, 20.0, 11.8, 8.8],
  LSTM:        [13.3, 7.3, 15.3, 12.1, 7.5],
  BiLSTM:      [13.1, 7.2, 15.6, 12.0, 8.9],
}

// (c) 散点图：参数量 (K) vs CPU 推理延迟 (μs)
export const scatterTradeOff = {
  CNN:         [[210.5, 523]],
  Transformer: [[69.8, 396]],
  MLP:         [[297.5, 28]],
  LSTM:        [[212.2, 2026]],
  BiLSTM:      [[146.6, 3411]],
}

// (d) 相关系数热力图 Pearson ρ
// data: [xIndex, yIndex, value]
export const correlationHeatmapData = [
  [0, 0, 0.5573], [1, 0, 0.4991], [2, 0, 0.5587], [3, 0, 0.4532], [4, 0, 0.4684],
  [0, 1, 0.5813], [1, 1, 0.5929], [2, 1, 0.6292], [3, 1, 0.5574], [4, 1, 0.5590],
]

export const yLabelsD = ['Surge (u-channel)', 'Yaw (r-channel)']

// 苹果风格配色：柔和、优雅
export const modelColorMap = {
  CNN:         '#007AFF',  // iOS 蓝
  Transformer: '#34C759',  // iOS 绿
  MLP:         '#FF2D55',  // iOS 粉红
  LSTM:        '#FF9500',  // iOS 橙
  BiLSTM:      '#AF52DE',  // iOS 紫
}

