<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

interface PieData {
  name: string;
  value: number;
  itemStyle?: {
    color: string;
  };
}

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  data: {
    type: Array as () => PieData[],
    required: true
  }
});

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

function initChart() {
  if (!chartRef.value) return;
  
  // Esperar a que el contenedor tenga dimensiones
  const checkSize = () => {
    if (chartRef.value && chartRef.value.clientWidth > 0 && chartRef.value.clientHeight > 0) {
      if (chart) {
        chart.dispose();
      }
      
      chart = echarts.init(chartRef.value);
      updateChart();
      
      // Configurar el observer para redimensionamiento
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      
      resizeObserver = new ResizeObserver(() => {
        if (chart) {
          chart.resize();
        }
      });
      
      resizeObserver.observe(chartRef.value);
    } else {
      requestAnimationFrame(checkSize);
    }
  };
  
  checkSize();
}

function updateChart() {
  if (!chart) return;

  const option = {
    title: {
      text: props.title,
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 14
      },
      padding: [10, 15],
      extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      textStyle: {
        color: '#666',
        fontSize: 12
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 15,
      formatter: function(name: string) {
        return name.length > 15 ? name.slice(0, 15) + '...' : name;
      }
    },
    series: [
      {
        name: props.title,
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'outside',
          formatter: '{b}: {d}%',
          fontSize: 12,
          color: '#666'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false,
          length: 15,
          length2: 10,
          smooth: true
        },
        data: props.data.map(item => ({
          ...item,
          tooltip: {
            formatter: function(params: any) {
              return `${params.name}<br/>${params.value} usuarios (${params.percent}%)`;
            }
          }
        }))
      }
    ]
  };

  chart.setOption(option);
}

watch(() => props.data, () => {
  if (chart) {
    updateChart();
  }
}, { deep: true });

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style> 