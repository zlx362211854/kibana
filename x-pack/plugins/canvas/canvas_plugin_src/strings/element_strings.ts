/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { i18nProvider } from './i18n_provider';

interface ElementStrings {
  displayName: string;
  help: string;
}

interface ElementStringDict {
  [elementName: string]: ElementStrings;
}

/**
 * This function will return a dictionary of strings, organized by Canvas
 * Element specification.  This function requires that `i18nProvider` be
 * properly initialized.
 */
export const getElementStrings = (): ElementStringDict => {
  const i18n = i18nProvider.getInstance();

  return {
    areaChart: {
      displayName: i18n.translate('xpack.canvas.elements.areaChartDisplayName', {
        defaultMessage: '面积表',
      }),
      help: i18n.translate('xpack.canvas.elements.areaChartHelpText', {
        defaultMessage: '带有实体的折线图',
      }),
    },
    bubbleChart: {
      displayName: i18n.translate('xpack.canvas.elements.bubbleChartDisplayName', {
        defaultMessage: '气泡图',
      }),
      help: i18n.translate('xpack.canvas.elements.bubbleChartHelpText', {
        defaultMessage: '可自定义的气泡图',
      }),
    },
    debug: {
      displayName: i18n.translate('xpack.canvas.elements.debugDisplayName', {
        defaultMessage: '调试',
      }),
      help: i18n.translate('xpack.canvas.elements.debugHelpText', {
        defaultMessage: '只需转储元素的配置',
      }),
    },
    donut: {
      displayName: i18n.translate('xpack.canvas.elements.donutChartDisplayName', {
        defaultMessage: '甜甜圈图表',
      }),
      help: i18n.translate('xpack.canvas.elements.donutChartHelpText', {
        defaultMessage: '可定制的圆环图',
      }),
    },
    dropdown_filter: {
      displayName: i18n.translate('xpack.canvas.elements.dropdownFilterDisplayName', {
        defaultMessage: '下拉筛选',
      }),
      help: i18n.translate('xpack.canvas.elements.dropdownFilterHelpText', {
        defaultMessage: '一个下拉列表，您可以从中选择“精确”过滤器的值',
      }),
    },
    horizontalBarChart: {
      displayName: i18n.translate('xpack.canvas.elements.horizontalBarChartDisplayName', {
        defaultMessage: '水平条形图',
      }),
      help: i18n.translate('xpack.canvas.elements.horizontalBarChartHelpText', {
        defaultMessage: '可定制的水平条形图',
      }),
    },
    horizontalProgressBar: {
      displayName: i18n.translate('xpack.canvas.elements.horizontalProgressBarDisplayName', {
        defaultMessage: '水平进度条',
      }),
      help: i18n.translate('xpack.canvas.elements.horizontalProgressBarHelpText', {
        defaultMessage: '将进度显示为水平条的一部分',
      }),
    },
    horizontalProgressPill: {
      displayName: i18n.translate('xpack.canvas.elements.horizontalProgressPillDisplayName', {
        defaultMessage: '水平进展丸',
      }),
      help: i18n.translate('xpack.canvas.elements.horizontalProgressPillHelpText', {
        defaultMessage: '将进度显示为水平药丸的一部分',
      }),
    },
    image: {
      displayName: i18n.translate('xpack.canvas.elements.imageDisplayName', {
        defaultMessage: '图片',
      }),
      help: i18n.translate('xpack.canvas.elements.imageHelpText', {
        defaultMessage: '静态图像',
      }),
    },
    lineChart: {
      displayName: i18n.translate('xpack.canvas.elements.lineChartDisplayName', {
        defaultMessage: '折线图',
      }),
      help: i18n.translate('xpack.canvas.elements.lineChartHelpText', {
        defaultMessage: '可自定义的折线图',
      }),
    },
    markdown: {
      displayName: i18n.translate('xpack.canvas.elements.markdownDisplayName', {
        defaultMessage: 'Markdown',
      }),
      help: i18n.translate('xpack.canvas.elements.markdownHelpText', {
        defaultMessage: '来自Markdown的标记',
      }),
    },
    metric: {
      displayName: i18n.translate('xpack.canvas.elements.metricDisplayName', {
        defaultMessage: '标签',
      }),
      help: i18n.translate('xpack.canvas.elements.metricHelpText', {
        defaultMessage: '带标签的数字',
      }),
    },
    pie: {
      displayName: i18n.translate('xpack.canvas.elements.pieDisplayName', {
        defaultMessage: '饼形图',
      }),
      help: i18n.translate('xpack.canvas.elements.pieHelpText', {
        defaultMessage: '饼形图',
      }),
    },
    plot: {
      displayName: i18n.translate('xpack.canvas.elements.plotDisplayName', {
        defaultMessage: '坐标图',
      }),
      help: i18n.translate('xpack.canvas.elements.plotHelpText', {
        defaultMessage: '混合线，条形图或圆点图',
      }),
    },
    progressGauge: {
      displayName: i18n.translate('xpack.canvas.elements.progressGaugeDisplayName', {
        defaultMessage: '进度表',
      }),
      help: i18n.translate('xpack.canvas.elements.progressGaugeHelpText', {
        defaultMessage: '将进度显示为量表的一部分',
      }),
    },
    progressSemicircle: {
      displayName: i18n.translate('xpack.canvas.elements.progressSemicircleDisplayName', {
        defaultMessage: '进步半圆',
      }),
      help: i18n.translate('xpack.canvas.elements.progressSemicircleHelpText', {
        defaultMessage: '将进度显示为半圆的一部分',
      }),
    },
    progressWheel: {
      displayName: i18n.translate('xpack.canvas.elements.progressWheelDisplayName', {
        defaultMessage: '进度轮',
      }),
      help: i18n.translate('xpack.canvas.elements.progressWheelHelpText', {
        defaultMessage: '将进度显示为车轮的一部分',
      }),
    },
    repeatImage: {
      displayName: i18n.translate('xpack.canvas.elements.repeatImageDisplayName', {
        defaultMessage: '重复图像',
      }),
      help: i18n.translate('xpack.canvas.elements.repeatImageHelpText', {
        defaultMessage: '重复图像N次',
      }),
    },
    revealImage: {
      displayName: i18n.translate('xpack.canvas.elements.revealImageDisplayName', {
        defaultMessage: '图像揭示',
      }),
      help: i18n.translate('xpack.canvas.elements.revealImageHelpText', {
        defaultMessage: '显示图像的百分比',
      }),
    },
    shape: {
      displayName: i18n.translate('xpack.canvas.elements.shapeDisplayName', {
        defaultMessage: '形状',
      }),
      help: i18n.translate('xpack.canvas.elements.shapeHelpText', {
        defaultMessage: '可定制的形状',
      }),
    },
    table: {
      displayName: i18n.translate('xpack.canvas.elements.tableDisplayName', {
        defaultMessage: '数据表格',
      }),
      help: i18n.translate('xpack.canvas.elements.tableHelpText', {
        defaultMessage: '用于以表格格式显示数据的可滚动网格',
      }),
    },
    tiltedPie: {
      displayName: i18n.translate('xpack.canvas.elements.tiltedPieDisplayName', {
        defaultMessage: '倾斜的饼图',
      }),
      help: i18n.translate('xpack.canvas.elements.tiltedPieHelpText', {
        defaultMessage: '可自定义的倾斜饼图',
      }),
    },
    time_filter: {
      displayName: i18n.translate('xpack.canvas.elements.timeFilterDisplayName', {
        defaultMessage: '时间过滤器',
      }),
      help: i18n.translate('xpack.canvas.elements.timeFilterHelpText', {
        defaultMessage: '设置时间窗口',
      }),
    },
    verticalBarChart: {
      displayName: i18n.translate('xpack.canvas.elements.verticalBarChartDisplayName', {
        defaultMessage: '垂直条形图',
      }),
      help: i18n.translate('xpack.canvas.elements.verticalBarChartHelpText', {
        defaultMessage: '可自定义的垂直条形图',
      }),
    },
    verticalProgressBar: {
      displayName: i18n.translate('xpack.canvas.elements.verticalProgressBarDisplayName', {
        defaultMessage: '垂直进度条',
      }),
      help: i18n.translate('xpack.canvas.elements.verticalProgressBarHelpText', {
        defaultMessage: '将进度显示为垂直条的一部分',
      }),
    },
    verticalProgressPill: {
      displayName: i18n.translate('xpack.canvas.elements.verticalProgressPillDisplayName', {
        defaultMessage: '垂直进展丸',
      }),
      help: i18n.translate('xpack.canvas.elements.verticalProgressPillHelpText', {
        defaultMessage: '将进度显示为垂直药丸的一部分',
      }),
    },
  };
};
