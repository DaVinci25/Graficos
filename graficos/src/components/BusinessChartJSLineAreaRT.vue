<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  chartType: {
    type: String,
    default: 'line'
  },
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#10b981'
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  data: {
    type: Array as () => number[],
    required: true
  },
  labels: {
    type: Array as () => string[],
    required: true
  },
  kpiTarget: {
    type: Number,
    required: true
  }
});

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

function updateChart() {
  if (!chartRef.value) return;

  if (chart) {
    chart.destroy();
  }

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  // Crear gradiente para el área bajo la línea
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, props.color + '40');
  gradient.addColorStop(1, props.color + '10');

  chart = new Chart(ctx, {
    type: props.chartType as any,
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.title,
          data: props.data,
          borderColor: props.color,
          backgroundColor: gradient,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: props.color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Objetivo KPI',
          data: Array(props.data.length).fill(props.kpiTarget),
          borderColor: '#10b981',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          min: props.min,
          max: props.max,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          align: 'end' as const,
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: {
              size: 12
            },
            generateLabels: function(chart: any) {
              const currentValue = props.data[props.data.length - 1];
              return [
                {
                  text: `Actual: ${currentValue} usuarios`,
                  fillStyle: props.color,
                  strokeStyle: props.color,
                  lineWidth: 2,
                  hidden: false,
                  index: 0
                },
                {
                  text: `Objetivo: ${props.kpiTarget} usuarios`,
                  fillStyle: '#10b981',
                  strokeStyle: '#10b981',
                  lineWidth: 2,
                  hidden: false,
                  index: 1
                }
              ];
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1e293b',
          bodyColor: '#64748b',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(context: any) {
              const currentValue = context.raw;
              const targetValue = props.kpiTarget;
              if (context.datasetIndex === 0) {
                return `Actual: ${currentValue} usuarios`;
              } else {
                return `Objetivo: ${targetValue} usuarios`;
              }
            }
          }
        }
      }
    }
  });
}

watch(() => props.data, updateChart, { deep: true });

onMounted(updateChart);
onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 