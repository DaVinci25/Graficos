<template>
  <div class="live-metrics-container">
    <div class="header">
      <h3 class="title">{{ title }}</h3>
      <div class="live-badge">TIEMPO REAL</div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  title: {
    type: String,
    default: 'Métricas de Servidor en Tiempo Real'
  },
  maxDataPoints: {
    type: Number,
    default: 60
  }
});

const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;
let timer: number | null = null;

// Datasets
const cpuData = ref<number[]>([]);
const ramData = ref<number[]>([]);
const requestsData = ref<number[]>([]);
const timePoints = ref<string[]>([]);

// Inicializar datos
const initData = () => {
  const now = new Date();
  for (let i = props.maxDataPoints; i > 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    timePoints.value.push(time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    cpuData.value.push(0);
    ramData.value.push(0);
    requestsData.value.push(0);
  }
};

// Simulación de datos de servidor
const generateRandomData = () => {
  // Valores aleatorios para CPU (45-85%)
  const newCpuValue = Math.floor(Math.random() * 40) + 45;
  
  // Valores aleatorios para RAM (50-90%)
  const newRamValue = Math.floor(Math.random() * 40) + 50;
  
  // Valores aleatorios para peticiones por segundo (10-50)
  const newRequestsValue = Math.floor(Math.random() * 40) + 10;
  
  // Añadir datos nuevos y eliminar el primero
  const now = new Date();
  timePoints.value.push(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  timePoints.value.shift();
  
  cpuData.value.push(newCpuValue);
  cpuData.value.shift();
  
  ramData.value.push(newRamValue);
  ramData.value.shift();
  
  requestsData.value.push(newRequestsValue);
  requestsData.value.shift();
  
  return {
    cpu: newCpuValue,
    ram: newRamValue,
    requests: newRequestsValue
  };
};

// Actualizar gráfico
const updateChart = () => {
  if (!chart) return;
  
  const newData = generateRandomData();
  
  chart.setOption({
    xAxis: {
      data: timePoints.value
    },
    series: [
      {
        name: 'CPU',
        data: cpuData.value
      },
      {
        name: 'RAM',
        data: ramData.value
      },
      {
        name: 'Peticiones/s',
        data: requestsData.value
      }
    ]
  });
};

// Inicializar gráfico
const initChart = () => {
  if (!chartRef.value) return;
  
  chart = echarts.init(chartRef.value);
  
  const option = {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['CPU', 'RAM', 'Peticiones/s'],
      top: 10,
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timePoints.value,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      splitLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    series: [
      {
        name: 'CPU',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(59, 130, 246, 0.8)'
            },
            {
              offset: 1,
              color: 'rgba(59, 130, 246, 0.1)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        symbol: 'none',
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#3b82f6'
        },
        data: cpuData.value
      },
      {
        name: 'RAM',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(16, 185, 129, 0.8)'
            },
            {
              offset: 1,
              color: 'rgba(16, 185, 129, 0.1)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        symbol: 'none',
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#10b981'
        },
        data: ramData.value
      },
      {
        name: 'Peticiones/s',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(245, 158, 11, 0.8)'
            },
            {
              offset: 1,
              color: 'rgba(245, 158, 11, 0.1)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        symbol: 'none',
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#f59e0b'
        },
        data: requestsData.value,
        yAxisIndex: 0
      }
    ]
  };
  
  chart.setOption(option);
};

onMounted(() => {
  initData();
  initChart();
  
  // Actualizar cada segundo
  timer = window.setInterval(() => {
    updateChart();
  }, 1000);
  
  // Resize handler
  window.addEventListener('resize', () => {
    chart && chart.resize();
  });
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
  chart && chart.dispose();
  window.removeEventListener('resize', () => {
    chart && chart.resize();
  });
});
</script>

<style scoped>
.live-metrics-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.live-badge {
  background-color: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  animation: pulse 2s infinite;
}

.chart-container {
  flex-grow: 1;
  width: 100%;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style> 