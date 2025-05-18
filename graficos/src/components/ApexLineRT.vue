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
  labels: {
    type: Array as () => string[],
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
  kpiTarget: {
    type: Number,
    default: null
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
      type: 'line',
      height: '100%',
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      zoom: {
        enabled: false
      }
    },
    series: [{
      name: props.title,
      data: props.data
    }],
    colors: [props.color],
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round'
    },
    fill: {
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
    markers: {
      size: 4,
      colors: [props.color],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    xaxis: {
      categories: props.labels,
      labels: {
        style: {
          fontSize: '12px'
        },
        rotate: -45,
        rotateAlways: false
      },
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
      },
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      title: {
        text: 'Ingresos (€)',
        style: {
          fontSize: '14px'
        }
      },
      labels: {
        formatter: function (val: number) {
          return val.toLocaleString() + '€';
        },
        show: true,
        showDuplicates: false,
        hideOverlappingLabels: true,
        style: {
          fontSize: '12px'
        }
      },
      min: 0,
      max: 2000,
      tickAmount: 3,
      forceNiceScale: false,
      axisTicks: {
        show: true
      }
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
      shared: true,
      intersect: false,
      y: {
        formatter: function (val: number) {
          if (val >= 1000000) {
            return (val / 1000000).toFixed(1) + 'M€';
          } else if (val >= 1000) {
            return (val / 1000).toFixed(1) + 'K€';
          }
          return val.toLocaleString() + '€';
        }
      }
    },
    legend: {
      show: false
    },
    annotations: {
      yaxis: [{
        y: props.kpiTarget,
        borderColor: '#10b981',
        label: {
          text: 'Objetivo',
          style: {
            color: '#fff',
            background: '#10b981'
          }
        }
      }]
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300
        },
        xaxis: {
          labels: {
            rotate: -45,
            rotateAlways: true,
            style: {
              fontSize: '10px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        },
        markers: {
          size: 3
        }
      }
    }]
  };

  chart = new ApexCharts(chartRef.value, options);
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