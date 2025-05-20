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
      },
      background: '#181f2a'
    },
    series: [{
      name: props.title,
      data: props.data
    }],
    colors: [props.color],
    stroke: {
      curve: 'smooth',
      width: 5,
      lineCap: 'round',
      dashArray: 0,
      dropShadow: {
        enabled: true,
        top: 2,
        left: 0,
        blur: 6,
        opacity: 0.4
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.4,
        gradientToColors: [props.color],
        inverseColors: false,
        opacityFrom: 0.85,
        opacityTo: 0.5,
        stops: [0, 100]
      }
    },
    markers: {
      size: 7,
      colors: ['#fff'],
      strokeColors: props.color,
      strokeWidth: 4,
      hover: {
        size: 10
      }
    },
    xaxis: {
      categories: props.labels,
      labels: {
        style: {
          fontSize: '14px',
          colors: '#e0e6ed'
        },
        rotate: -45,
        rotateAlways: false
      },
      axisBorder: {
        show: true,
        color: '#3b82f6'
      },
      axisTicks: {
        show: true,
        color: '#3b82f6'
      },
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      title: {
        text: 'Ingresos (€)',
        style: {
          fontSize: '16px',
          color: '#e0e6ed'
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
          fontSize: '14px',
          colors: '#e0e6ed'
        }
      },
      min: 0,
      max: 2000,
      tickAmount: 3,
      forceNiceScale: false,
      axisTicks: {
        show: true,
        color: '#3b82f6'
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
          show: true,
          color: '#232b3e'
        }
      },
      yaxis: {
        lines: {
          show: true,
          color: '#232b3e'
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
      custom: undefined,
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
          text: `🎯 Objetivo: ${props.kpiTarget}`,
          style: {
            color: '#fff',
            background: '#10b981',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: {
              left: 12,
              right: 12,
              top: 6,
              bottom: 6
            },
            borderRadius: 8,
            shadow: '0 2px 8px rgba(16,185,129,0.3)'
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
              fontSize: '10px',
              colors: '#e0e6ed'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '10px',
              colors: '#e0e6ed'
            }
          }
        },
        markers: {
          size: 5
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