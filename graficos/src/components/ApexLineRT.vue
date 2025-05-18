<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import ApexCharts from 'apexcharts';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#3b82f6'
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
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: true
  },
  kpiTarget: {
    type: Number,
    default: null
  }
});

const chartRef = ref<HTMLElement | null>(null);
let chart: ApexCharts | null = null;
let updateInterval: number | null = null;

function updateData() {
  if (!chart) return;
  
  const newData = [...props.data];
  newData.shift();
  newData.push(Math.floor(Math.random() * (props.max - props.min) + props.min));
  
  chart.updateSeries([{
    data: newData
  }]);
}

function initChart() {
  if (!chartRef.value) return;

  const options = {
    chart: {
      type: 'line',
      height: '100%',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      }
    },
    series: [{
      name: props.title,
      data: props.data
    }],
    xaxis: {
      categories: props.labels
    },
    yaxis: {
      min: props.min,
      max: props.max
    },
    colors: [props.color],
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3
      }
    }
  };

  if (props.kpiTarget) {
    options.annotations = {
      yaxis: [{
        y: props.kpiTarget,
        borderColor: '#00E396',
        label: {
          borderColor: '#00E396',
          style: {
            color: '#fff',
            background: '#00E396'
          },
          text: 'KPI Target'
        }
      }]
    };
  }

  chart = new ApexCharts(chartRef.value, options);
  chart.render();
}

onMounted(() => {
  initChart();
  updateInterval = window.setInterval(updateData, 3000);
});

onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});

watch(() => props.data, () => {
  if (chart) {
    chart.updateSeries([{
      data: props.data
    }]);
  }
}, { deep: true });
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style> 