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
    type: Array as () => number[],
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

  const options = {
    chart: {
      type: 'bar',
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
        text: 'Audiencia'
      }
    },
    fill: {
      opacity: 1
    },
    title: {
      text: props.title,
      align: 'center'
    }
  };

  chart = new ApexCharts(chartRef.value, {
    series: [{
      name: 'Audiencia',
      data: props.data
    }],
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