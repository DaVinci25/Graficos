<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  data: {
    type: Array as () => { name: string; value: number }[],
    required: true
  }
});

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

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

  const options = {
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: props.data.map(item => item.name)
    },
    series: [
      {
        name: props.title,
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: props.data
      }
    ]
  };

  chart.setOption(options);
}

// Usar ResizeObserver para manejar cambios de tamaño
let resizeObserver: ResizeObserver | null = null;

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

watch(() => props.data, updateChart, { deep: true });
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style> 