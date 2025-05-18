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
            <div class="kpi-trend" :class="cpuUsage > 70 ? 'warning' : 'good'">
              {{ cpuUsage > 70 ? 'Alto' : 'Normal' }}
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ memoryUsage }}%</div>
            <div class="kpi-title">Memoria RAM</div>
            <div class="kpi-trend" :class="memoryUsage > 80 ? 'warning' : 'good'">
              {{ memoryUsage > 80 ? 'Alto' : 'Normal' }}
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ apiResponseTime }}ms</div>
            <div class="kpi-title">Tiempo de Respuesta</div>
            <div class="kpi-trend" :class="apiResponseTime > 300 ? 'warning' : 'good'">
              {{ apiResponseTime > 300 ? 'Lento' : 'Rápido' }}
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ crashRate }}%</div>
            <div class="kpi-title">Tasa de Fallos</div>
            <div class="kpi-trend" :class="crashRate > 2 ? 'warning' : 'good'">
              {{ crashRate > 2 ? 'Alta' : 'Baja' }}
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ appSize }}MB</div>
            <div class="kpi-title">Tamaño App</div>
            <div class="kpi-trend good">Optimizado</div>
          </div>
        </div>

        <!-- Primera fila: Rendimiento y Errores -->
        <div class="chart-row">
          <div class="chart-container large">
            <EchartsGaugeMultiple 
              :segments="[
                { name: 'CPU', value: cpuUsage, color: '#3b82f6', max: 100 },
                { name: 'RAM', value: memoryUsage, color: '#10b981', max: 100 },
                { name: 'GPU', value: 45, color: '#f59e0b', max: 100 }
              ]"
            />
          </div>
          <div class="chart-container large">
            <TechnicalChartJSLineAreaRT 
              chartType="line" 
              title="Errores por Versión" 
              color="#ef4444"
              :min="0"
              :max="50"
              :data="errorsByVersionData"
              :labels="versions"
            />
          </div>
        </div>

        <!-- Segunda fila: Métricas en Tiempo Real -->
        <div class="chart-row">
          <div class="chart-container full-width">
            <LiveServerMetrics 
              title="Métricas de Servidor en Tiempo Real"
              :maxDataPoints="30"
            />
          </div>
        </div>

        <!-- Tercera fila: Módulos y Versiones -->
        <div class="chart-row">
          <div class="chart-container large">
            <EchartsPie 
              :data="moduleUsageData"
              title="Uso de Módulos de la App"
            />
          </div>
          <div class="chart-container large">
            <ApexBar 
              title="Tasa de Adopción de Versiones"
              :data="versionAdoptionData"
              :categories="versions"
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
import ApexBar from '@/components/ApexBar.vue';
import EchartsGauge from '@/components/EchartsGauge.vue';
import EchartsPie from '@/components/EchartsPie.vue';
import EchartsGaugeMultiple from '@/components/EchartsGaugeMultiple.vue';
import LiveServerMetrics from '@/components/LiveServerMetrics.vue';
import { ref, onMounted } from 'vue';

// KPI Values
const cpuUsage = ref(68);
const memoryUsage = ref(76);
const apiResponseTime = ref(280);
const crashRate = ref(1.7);
const appSize = ref(48.5);

// Datos para gráficos
const versions = ref(['v1.0', 'v1.1', 'v1.2', 'v2.0', 'v2.1']);

// Datos de errores por versión (KPI: Estabilidad)
const errorsByVersionData = ref([42, 35, 28, 15, 8]);

// Datos de uso de módulos (KPI: Análisis de uso)
const moduleUsageData = ref([
  { name: 'Perfil', value: 20 },
  { name: 'Rutinas', value: 40 },
  { name: 'Nutrición', value: 25 },
  { name: 'Social', value: 15 }
]);

// Datos de adopción de versiones (KPI: Adopción tecnológica)
const versionAdoptionData = ref([5, 10, 15, 30, 40]);
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  max-width: 1500px;
  margin: 0 auto;
  height: calc(100vh - 56px);
  box-sizing: border-box;
  overflow: auto;
  margin-top: 56px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
}

.kpi-cards {
  display: flex;
  gap: 1rem;
  width: 100%;
  position: relative;
  z-index: 2;
  margin-bottom: 1rem;
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
  height: 120px;
  text-align: center;
  border-top: 4px solid #3b82f6;
  position: relative;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
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

.kpi-trend.good {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.kpi-trend.warning {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.chart-row {
  display: flex;
  gap: 1rem;
  width: 100%;
  min-height: 0;
  flex: 1;
  height: calc((100vh - 250px - 4rem) / 3);
  position: relative;
  z-index: 2;
}

.chart-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1rem;
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
  width: calc(50% - 0.5rem);
}

.chart-container.full-width {
  width: 100%;
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
  overflow: auto;
  --background: transparent;
}

@media (max-width: 768px) {
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