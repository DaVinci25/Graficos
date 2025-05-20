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
  kpiTarget: {
    type: Number,
    default: null
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
        annotation: props.kpiTarget !== null ? {
          annotations: {
            kpiLine: {
              type: 'line',
              yMin: props.kpiTarget,
              yMax: props.kpiTarget,
              borderColor: '#10b981',
              borderWidth: 2,
              borderDash: [6, 6],
              label: {
                enabled: true,
                content: `Objetivo: ${props.kpiTarget}`,
                position: 'end',
                backgroundColor: '#10b981',
                color: '#fff',
                font: {
                  weight: 'bold'
                }
              }
            }
          }
        } : undefined
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