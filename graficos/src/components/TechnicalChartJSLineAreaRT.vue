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
    default: '#ef4444'
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

  chart = new Chart(ctx, {
    type: props.chartType as any,
    data: {
      labels: props.data.map((_, i) => i + 1),
      datasets: [{
        label: props.title,
        data: props.data,
        borderColor: props.color,
        backgroundColor: props.color + '40',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          min: props.min,
          max: props.max
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
                  text: `Actual: ${currentValue}`,
                  fillStyle: props.color,
                  strokeStyle: props.color,
                  lineWidth: 2,
                  hidden: false,
                  index: 0
                },
                {
                  text: `Objetivo: ${props.kpiTarget}`,
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
          callbacks: {
            label: function(context: any) {
              const currentValue = context.raw;
              const targetValue = props.kpiTarget;
              return [
                `Actual: ${currentValue}`,
                `Objetivo: ${targetValue}`
              ];
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
}
</style> 