<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar class="dashboard-header">
        <ion-buttons slot="start">
          <ion-menu-button color="light"></ion-menu-button>
        </ion-buttons>
        <ion-title class="dashboard-title">Dashboard Analytics</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="dashboard-content">
      <div class="dashboard-container">
        <div class="dashboard-header-content">
          <h1>Analytics Overview</h1>
          <p>Real-time monitoring and business insights</p>
        </div>

        <div class="chart-grid">
          <div class="chart-container glass-effect">
            <div class="chart-header">
              <h3>Business Growth</h3>
              <span class="trend-indicator positive">+12.5%</span>
            </div>
            <canvas ref="businessChart"></canvas>
          </div>

          <div class="chart-container glass-effect">
            <div class="chart-header">
              <h3>Technical Performance</h3>
              <span class="trend-indicator neutral">Stable</span>
            </div>
            <canvas ref="technicalChart"></canvas>
          </div>

          <div class="chart-container glass-effect">
            <div class="chart-header">
              <h3>Real-time Metrics</h3>
              <span class="trend-indicator live">Live</span>
            </div>
            <div ref="realtimeChart" class="chart-content"></div>
          </div>

          <div class="chart-container glass-effect">
            <div class="chart-header">
              <h3>System Health</h3>
              <span class="trend-indicator positive">98%</span>
            </div>
            <div ref="performanceChart" class="chart-content"></div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import ApexCharts from 'apexcharts';
import * as echarts from 'echarts';

// Chart references
const businessChart = ref<HTMLCanvasElement | null>(null);
const technicalChart = ref<HTMLCanvasElement | null>(null);
const realtimeChart = ref<HTMLElement | null>(null);
const performanceChart = ref<HTMLElement | null>(null);

// Initialize charts
onMounted(() => {
  // Initialize Chart.js chart
  if (businessChart.value) {
    new Chart(businessChart.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Business Growth',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Initialize ApexCharts
  if (realtimeChart.value) {
    const options = {
      chart: {
        type: 'area',
        height: 350,
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3
        }
      },
      series: [{
        name: 'Real-time Data',
        data: []
      }],
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#666',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#666',
            fontSize: '12px'
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      }
    };
    const chart = new ApexCharts(realtimeChart.value, options);
    chart.render();
  }

  // Initialize ECharts
  if (performanceChart.value) {
    const chart = echarts.init(performanceChart.value);
    const option = {
      title: {
        text: 'Performance Metrics',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4', 'Metric 5'],
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [{
        name: 'Value',
        type: 'bar',
        data: [5, 20, 36, 10, 10],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        }
      }]
    };
    chart.setOption(option);
  }
});
</script>

<style scoped>
.dashboard-header {
  --background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  --color: white;
}

.dashboard-title {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.dashboard-content {
  --background: #f0f2f5;
}

.dashboard-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header-content {
  margin-bottom: 32px;
  text-align: center;
}

.dashboard-header-content h1 {
  font-size: 2rem;
  color: #1e3c72;
  margin: 0;
  font-weight: 700;
}

.dashboard-header-content p {
  color: #666;
  margin: 8px 0 0;
  font-size: 1.1rem;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.chart-container {
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.chart-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  color: #1e3c72;
  font-size: 1.2rem;
  font-weight: 600;
}

.trend-indicator {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.trend-indicator.positive {
  background: rgba(46, 213, 115, 0.15);
  color: #2ed573;
}

.trend-indicator.neutral {
  background: rgba(255, 171, 0, 0.15);
  color: #ffab00;
}

.trend-indicator.live {
  background: rgba(255, 71, 87, 0.15);
  color: #ff4757;
  animation: pulse 2s infinite;
}

.chart-content {
  height: 300px;
  width: 100%;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .chart-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header-content h1 {
    font-size: 1.5rem;
  }

  .dashboard-header-content p {
    font-size: 1rem;
  }
}
</style>
