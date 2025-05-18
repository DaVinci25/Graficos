<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  segments: {
    type: Number,
    default: 5
  },
  max: {
    type: Number,
    default: 100
  }
});

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

async function initChart() {
  if (!chartRef.value) return;
  
  // Esperar a que el DOM esté listo
  await nextTick();
  
  if (chart) {
    chart.dispose();
  }

  chart = echarts.init(chartRef.value);
  updateChart();
}

function updateChart() {
  if (!chart) return;

  const option = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: props.max,
      splitNumber: props.segments,
      radius: '90%',
      axisLine: {
        lineStyle: {
          width: 30,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 20,
        offsetCenter: [0, '-60%'],
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        length: 12,
        lineStyle: {
          color: 'auto',
          width: 1
        }
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: 'auto',
          width: 2
        }
      },
      axisLabel: {
        color: '#464646',
        fontSize: 12,
        distance: 25
      },
      title: {
        offsetCenter: [0, '20%'],
        fontSize: 20,
        color: '#333'
      },
      detail: {
        fontSize: 30,
        offsetCenter: [0, '0%'],
        valueAnimation: true,
        formatter: function(value: number) {
          return value.toFixed(1);
        },
        color: 'auto'
      },
      data: [{
        value: props.value,
        name: props.title
      }]
    }]
  };

  chart.setOption(option);
}

onMounted(async () => {
  await initChart();
  
  // Configurar ResizeObserver
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (chart) {
        chart.resize();
      }
    });
    resizeObserver.observe(chartRef.value);
  }
});

onUnmounted(() => {
  if (chart) {
    chart.dispose();
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(() => props.value, updateChart);
watch(() => props.title, updateChart);
watch(() => props.segments, updateChart);
watch(() => props.max, updateChart);
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>