// 苹果风格图表配置
export const appleChartTheme = {
  // 字体配置
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',

  // 颜色配置
  colors: {
    primary: '#007AFF',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    purple: '#AF52DE',
    text: {
      primary: '#1d1d1f',
      secondary: '#86868b',
      tertiary: '#d2d2d7',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f5f5f7',
      tertiary: '#fafafa',
    },
    border: 'rgba(0, 0, 0, 0.06)',
    grid: 'rgba(0, 0, 0, 0.04)',
  },

  // 模型颜色
  modelColors: ['#007AFF', '#34C759', '#FF2D55', '#FF9500', '#AF52DE'],

  // 通用配置
  getBaseConfig: () => ({
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
      fontSize: 13,
      color: '#1d1d1f',
    },
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
  }),

  // 网格配置
  getGridConfig: () => ({
    top: 60,
    left: 20,
    right: 20,
    bottom: 70,
    containLabel: true,
  }),

  // 图例配置
  getLegendConfig: () => ({
    bottom: 10,
    left: 'center',
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 16,
    textStyle: {
      fontSize: 12,
      color: '#86868b',
      fontWeight: 500,
    },
    icon: 'circle',
  }),

  // 提示框配置
  getTooltipConfig: () => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderWidth: 1,
    textStyle: {
      color: '#1d1d1f',
      fontSize: 13,
      fontWeight: 500,
    },
    padding: [12, 16],
    extraCssText: 'border-radius: 12px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); backdrop-filter: blur(20px);',
  }),

  // 坐标轴配置
  getAxisConfig: (isXAxis = true) => ({
    axisLine: {
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.06)',
        width: 1,
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#86868b',
      fontSize: 12,
      fontWeight: 500,
      margin: isXAxis ? 12 : 16,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.04)',
        width: 1,
        type: 'solid',
      },
    },
    nameTextStyle: {
      color: '#86868b',
      fontSize: 12,
      fontWeight: 600,
      padding: isXAxis ? [8, 0, 0, 0] : [0, 0, 0, 8],
    },
  }),
}
