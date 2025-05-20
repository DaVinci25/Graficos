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
      },
      height: '100%',
      parentHeightOffset: 0,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        distributed: false,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toLocaleString();
      },
      style: {
        fontSize: '12px',
        colors: ['#333']
      },
      offsetY: -20
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: props.categories,
      labels: {
        style: {
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
      }
    },
    yaxis: {
      title: {
        text: 'Audiencia',
        style: {
          fontSize: '14px'
        }
      },
      labels: {
        formatter: function (val: number) {
          return val.toLocaleString();
        }
      },
      min: 0,
      forceNiceScale: true
    },
    fill: {
      opacity: 1,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [0, 100]
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetY: 0,
      itemMargin: {
        horizontal: 10
      },
      onItemClick: {
        toggleDataSeries: true
      }
    },
    title: {
      text: props.title,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      },
      offsetY: 10
    },
    grid: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '15px',
        color: '#fff'
      },
      fillSeriesColor: false,
      marker: {
        show: true
      },
      y: {
        formatter: function (val: number) {
          return val.toLocaleString() + ' usuarios';
        }
      },
      shared: true,
      intersect: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetY: 0
        },
        dataLabels: {
          enabled: false
        }
      }
    }]
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