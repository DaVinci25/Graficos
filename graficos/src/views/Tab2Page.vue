<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="dashboard-header">
        <ion-title>Dashboard Técnico</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="dashboard-content">
      <div class="dashboard-container">
        <!-- Primera fila: KPIs Técnicos -->
        <div class="kpi-cards">
          <div class="kpi-card">
            <div class="kpi-value">{{ cpuUsage }}%</div>
            <div class="kpi-title">Uso de CPU</div>
            <div class="kpi-trend" :class="cpuTrend >= 0 ? 'up' : 'down'">
              {{ cpuTrend >= 0 ? '+' : '' }}{{ cpuTrend }}%
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ responseTime }}ms</div>
            <div class="kpi-title">Tiempo de Respuesta</div>
            <div class="kpi-trend" :class="responseTimeTrend >= 0 ? 'down' : 'up'">
              {{ responseTimeTrend >= 0 ? '+' : '' }}{{ responseTimeTrend }}%
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ errorRate }}%</div>
            <div class="kpi-title">Tasa de Errores</div>
            <div class="kpi-trend" :class="errorRateTrend >= 0 ? 'down' : 'up'">
              {{ errorRateTrend >= 0 ? '+' : '' }}{{ errorRateTrend }}%
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ uptime }}%</div>
            <div class="kpi-title">Disponibilidad</div>
            <div class="kpi-trend up">+0.02%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ appSize }}MB</div>
            <div class="kpi-title">Tamaño de App</div>
            <div class="kpi-trend down">-3%</div>
          </div>
        </div>

        <!-- Segunda fila: Métricas de Rendimiento -->
        <div class="chart-row">
          <div class="chart-container large">
            <LiveServerMetrics 
              title="Métricas del Servidor en Tiempo Real"
              :maxDataPoints="60"
            />
          </div>
          <div class="chart-container large">
            <TechnicalChartJSLineAreaRT 
              chartType="line" 
              title="Uso de Recursos del Sistema" 
              color="#ef4444"
              :min="0"
              :max="100"
              :data="systemResourcesData"
            />
          </div>
        </div>

        <!-- Tercera fila: Errores y Latencia -->
        <div class="chart-row">
          <div class="chart-container large">
            <ApexLineRT 
              title="Latencia de la API (ms)"
              :min="0"
              :max="500"
              :data="apiLatencyData"
              :labels="timeLabels"
              color="#3b82f6"
              :kpiTarget="250"
            />
          </div>
          <div class="chart-container large">
            <TechnicalChartJSLineAreaRT 
              chartType="bar" 
              title="Errores por Tipo" 
              color="#f59e0b"
              :min="0"
              :max="100"
              :data="errorTypesData"
              :kpiTarget="10"
            />
          </div>
        </div>

        <!-- Cuarta fila: Estado del Sistema -->
        <div class="chart-row">
          <div class="chart-container full-width">
            <CustomProgressChart 
              title="Estado del Sistema"
              :data="systemStatusData"
              :maxValue="100"
              unit="%"
              baseColor="#3b82f6"
            />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { ref } from 'vue';
import TechnicalChartJSLineAreaRT from '@/components/TechnicalChartJSLineAreaRT.vue';
import ApexLineRT from '@/components/ApexLineRT.vue';
import LiveServerMetrics from '@/components/LiveServerMetrics.vue';
import CustomProgressChart from '@/components/CustomProgressChart.vue';

// KPI Values
const cpuUsage = ref(68);
const responseTime = ref(280);
const errorRate = ref(1.7);
const uptime = ref(99.95);
const appSize = ref(48.5);

// Trends
const cpuTrend = ref(5);
const responseTimeTrend = ref(-7);
const errorRateTrend = ref(-5);

// Time labels for charts
const timeLabels = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setHours(date.getHours() - (11 - i));
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
});

// System Resources Data
const systemResourcesData = ref([
  65, 68, 72, 70, 75, 68, 72, 70, 65, 68, 72, 70
]);

// API Latency Data
const apiLatencyData = ref([
  280, 290, 275, 285, 270, 265, 280, 290, 275, 285, 270, 265
]);

// Error Types Data
const errorTypesData = ref([
  15, 12, 18, 10, 14, 16, 13, 11, 17, 14, 12, 15
]);

// System Status Data
const systemStatusData = ref([
  { label: 'CPU', value: 68, target: 80 },
  { label: 'Memoria', value: 75, target: 85 },
  { label: 'Disco', value: 45, target: 70 },
  { label: 'Red', value: 92, target: 95 }
]);
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  max-width: 1800px;
  margin: 0 auto;
  height: calc(100vh - 56px);
  box-sizing: border-box;
  margin-top: 56px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.kpi-cards {
  display: flex;
  gap: 1rem;
  width: 100%;
  position: relative;
  z-index: 2;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
  flex-wrap: wrap;
  height: 100px;
}

.kpi-card {
  flex: 1;
  min-width: 220px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  border-top: 4px solid #3b82f6;
  position: relative;
}

.chart-row {
  display: flex;
  gap: 1rem;
  width: 100%;
  flex: 1;
  min-height: 0;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
}

.chart-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
}

.chart-container.large {
  flex: 1;
  min-width: calc(50% - 0.5rem);
  width: calc(50% - 0.5rem);
  height: calc((100vh - 56px - 100px - 4rem) / 3);
}

.chart-container.full-width {
  width: 100%;
  height: calc((100vh - 56px - 100px - 4rem) / 3);
  margin-bottom: 0;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #16213e;
  margin-bottom: 0.25rem;
}

.kpi-title {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.kpi-trend {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.kpi-trend.up {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.kpi-trend.down {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.dashboard-header {
  --background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  --color: white;
  height: 56px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dashboard-content {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  overflow: hidden;
  --background: transparent;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .kpi-cards {
    gap: 0.75rem;
    height: 90px;
  }
  
  .kpi-card {
    flex: 1 1 calc(50% - 0.75rem);
    min-width: calc(50% - 0.75rem);
    padding: 0.5rem;
  }
  
  .chart-row {
    flex-direction: column;
    min-height: 0;
    gap: 0.75rem;
  }
  
  .chart-container {
    padding: 0.75rem;
  }
  
  .chart-container.large {
    width: 100%;
    min-width: 100%;
    height: calc((100vh - 56px - 90px - 3rem) / 3);
  }

  .chart-container.full-width {
    height: calc((100vh - 56px - 90px - 3rem) / 3);
  }
}
</style> 