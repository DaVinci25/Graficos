<template>
    <div ref="chart" style="width: 100%; height: 100%;"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import * as echarts from 'echarts'
  
  const props = defineProps({
    segments: {
      type: Array as () => Array<{
        value: number
        name: string
        color: string
        min?: number
        max?: number
      }>,
      required: true
    }
  })
  
  const chart = ref<HTMLElement | null>(null)
  
  onMounted(() => {
    if (chart.value) {
      const myChart = echarts.init(chart.value)
      updateChart(myChart)
    }
  })
  
  watch(() => props.segments, () => {
    if (chart.value) {
      const myChart = echarts.getInstanceByDom(chart.value)
      if (myChart) {
        updateChart(myChart)
      }
    }
  }, { deep: true })
  
  function updateChart(chartInstance: echarts.ECharts) {
    const option = {
      series: props.segments.map((segment, index) => ({
        type: 'gauge',
        startAngle: 90 + (index * 360 / props.segments.length),
        endAngle: 90 + ((index + 1) * 360 / props.segments.length),
        radius: `${100 - (index * 15)}%`,
        axisLine: {
          lineStyle: {
            width: 15,
            color: [[1, segment.color]]
          }
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          show: true,
          offsetCenter: [0, '0%'],
          color: segment.color,
          fontSize: 20,
          fontWeight: 'bold',
          formatter: '{value}%'
        },
        data: [{
          value: segment.value,
          name: segment.name
        }],
        min: segment.min || 0,
        max: segment.max || 100,
        title: {
          show: true,
          offsetCenter: [0, '-40%'],
          color: segment.color,
          fontSize: 12,
          fontWeight: 'bold'
        }
      }))
    }
    chartInstance.setOption(option)
  }
  </script>