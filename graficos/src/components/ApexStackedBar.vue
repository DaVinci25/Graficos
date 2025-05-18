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
  data: {
    type: Object as () => Record<string, number[]>,
    required: true
  },
  categories: {
    type: Array as () => string[],
    required: true
  }
});

const chartRef = ref<HTMLElement | null>(null);
let chart: ApexCharts | null = null;

function updateChart() {
  if (!chartRef.value) return;

  if (chart) {
    chart.destroy();
  }

  const series = Object.entries(props.data).map(([name, data]) => ({
    name,
    data
  }));

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: props.categories
    },
    yaxis: {
      title: {
        text: 'Interacciones'
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'bottom'
    },
    title: {
      text: props.title,
      align: 'center'
    }
  };

  chart = new ApexCharts(chartRef.value, {
    series,
    ...options
  });

  chart.render();
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