<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="dashboard-header">
        <ion-title>Dashboard Técnico</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="dashboard-content">
      <div class="dashboard-container">
        <!-- KPI Cards -->
        <div class="kpi-cards">
          <div class="kpi-card">
            <div class="kpi-value">{{ cpuUsage }}%</div>
            <div class="kpi-title">Uso de CPU</div>
            <div class="kpi-trend down">-5%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ responseTime }}ms</div>
            <div class="kpi-title">Tiempo de Respuesta</div>
            <div class="kpi-trend up">-7%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ errorRate }}%</div>
            <div class="kpi-title">Tasa de Fallos</div>
            <div class="kpi-trend up">-5%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ availability }}%</div>
            <div class="kpi-title">Disponibilidad</div>
            <div class="kpi-trend up">+0.02%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ appSize }}MB</div>
            <div class="kpi-title">Tamaño de la App</div>
            <div class="kpi-trend up">-3%</div>
          </div>
        </div>

        <!-- Primera fila: Métricas en tiempo real -->
        <div class="chart-row">
          <div class="chart-container full-width">
            <LiveServerMetrics 
              title="Métricas del Servidor en Tiempo Real"
              :maxDataPoints="60"
            />
          </div>
        </div>

        <!-- Segunda fila: CPU y Memoria -->
        <div class="chart-row">
          <div class="chart-container large">
            <TechnicalChartJSLineAreaRT 
              chartType="line" 
              title="Uso de CPU en Tiempo Real" 
              color="#ef4444"
              :min="0"
              :max="100"
              :data="cpuData"
              :kpiTarget="70"
            />
          </div>
          <div class="chart-container large">
            <TechnicalChartJSLineAreaRT 
              chartType="line" 
              title="Uso de Memoria en Tiempo Real" 
              color="#f59e0b"
              :min="0"
              :max="100"
              :data="memoryData"
              :kpiTarget="65"
            />
          </div>
        </div>

        <!-- Tercera fila: Distribución de errores -->
        <div class="chart-row">
          <div class="chart-container full-width">
            <EchartsPie 
              title="Distribución de Errores por Tipo"
              :data="errorDistributionData"
            />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import TechnicalChartJSLineAreaRT from '@/components/TechnicalChartJSLineAreaRT.vue';
import LiveServerMetrics from '@/components/LiveServerMetrics.vue';
import EchartsPie from '@/components/EchartsPie.vue';
import CustomProgressChart from '@/components/CustomProgressChart.vue';
import { ref } from 'vue';

// KPI Values
const cpuUsage = ref(68);
const responseTime = ref(280);
const errorRate = ref(1.7);
const availability = ref(99.95);
const appSize = ref(48.5);

// Datos de CPU (KPI: Uso de CPU)
const cpuData = ref([68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95]);

// Datos de memoria (KPI: Uso de memoria)
const memoryData = ref([45, 48, 50, 52, 55, 58, 60, 62, 65, 68, 70, 72]);

// Datos de distribución de errores
const errorDistributionData = ref([
  { name: 'Logrado', value: 75, itemStyle: { color: '#10b981' } },
  { name: 'Fallado', value: 25, itemStyle: { color: '#ef4444' } }
]);

// Datos de rendimiento
const performanceData = ref([
  { label: 'CPU', value: 68, target: 60 },
  { label: 'Memoria', value: 75, target: 70 },
  { label: 'Disco', value: 60, target: 65 },
  { label: 'Red', value: 90, target: 85 }
]);

// Datos de interacciones con rutinas
const rutinasData = ref({
  'Rutina en casa': [30, 50, 70, 20],
  'Rutina en gimnasio': [50, 50, 20, 60],
  'Rutina al aire libre': [30, 60, 50, 40]
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  padding-bottom: 80px;
  max-width: 1500px;
  margin: 0 auto;
  height: calc(100vh - 56px);
  box-sizing: border-box;
  overflow: hidden;
  margin-top: 56px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  position: relative;
  z-index: 1;
}

.kpi-cards {
  display: flex;
  gap: 1rem;
  width: 100%;
  position: relative;
  z-index: 2;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
}

.kpi-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  text-align: center;
  border-top: 4px solid #3b82f6;
  position: relative;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #16213e;
  margin-bottom: 0.5rem;
}

.kpi-title {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
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

.chart-row {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  flex: 1;
  min-height: 0;
  position: relative;
  z-index: 2;
}

.chart-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
}

.chart-container.large {
  flex: 1;
  min-width: 0;
  width: calc(50% - 0.75rem);
}

.chart-container.full-width {
  width: 100%;
  height: 300px;
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
    padding-bottom: 100px; /* Más espacio para el menú en móvil */
  }
  
  .kpi-cards {
    flex-wrap: wrap;
  }
  
  .kpi-card {
    flex: 1 1 calc(50% - 1rem);
    min-width: calc(50% - 1rem);
  }
  
  .chart-row {
    flex-direction: column;
    height: auto;
  }
  
  .chart-container.large {
    width: 100%;
    height: 300px;
  }
}
</style>