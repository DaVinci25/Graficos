<template>
  <div class="chart-wrapper">
    <Line v-if="chartType === 'line'" :data="chartData" :options="chartOptions" />
    <Bar v-else-if="chartType === 'bar'" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Line, Bar } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps<{
  chartType: 'line' | 'bar';
  title: string;
  color: string;
  min: number;
  max: number;
}>();

const chartData = ref({
  labels: [] as string[],
  datasets: [{
    label: props.title,
    data: [] as number[],
    borderColor: props.color,
    backgroundColor: props.color + '20',
    fill: props.chartType === 'area',
    tension: 0.4
  }]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0
  },
  scales: {
    y: {
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
      display: false
    }
  }
});

let interval: ReturnType<typeof setInterval>;

function updateChart() {
  const newValue = Math.floor(Math.random() * (props.max - props.min + 1)) + props.min;
  const timestamp = new Date().toLocaleTimeString();
  
  chartData.value.labels.push(timestamp);
  chartData.value.datasets[0].data.push(newValue);
  
  if (chartData.value.labels.length > 20) {
    chartData.value.labels.shift();
    chartData.value.datasets[0].data.shift();
  }
}

onMounted(() => {
  interval = setInterval(updateChart, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.chart-wrapper {
  height: 300px;
  width: 100%;
}
</style> 