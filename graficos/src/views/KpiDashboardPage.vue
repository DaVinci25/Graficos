<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="dashboard-header">
        <ion-title>Dashboard de KPIs</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="dashboard-content">
      <div class="dashboard-container">
        <!-- Sección de KPIs de Negocio -->
        <div class="kpi-section business-section">
          <h2 class="section-title">KPIs de Negocio</h2>
          <div class="kpi-grid">
            <div class="kpi-card" v-for="(kpi, index) in businessKpis" :key="'business-'+index">
              <div class="kpi-header">
                <h3 class="kpi-name">{{ kpi.name }}</h3>
                <div class="kpi-status" :class="kpi.status">{{ kpi.statusText }}</div>
              </div>
              <div class="kpi-value-container">
                <div class="kpi-value">{{ kpi.value }}</div>
                <div class="kpi-unit">{{ kpi.unit }}</div>
              </div>
              <div class="kpi-chart">
                <ApexLineRT 
                  v-if="kpi.chartData"
                  :min="kpi.chartMin"
                  :max="kpi.chartMax"
                  :data="kpi.chartData"
                  :labels="timeLabels"
                  :color="kpi.chartColor"
                  :showAxis="false"
                  :showLegend="false"
                  height="60px"
                />
                <div v-else class="trend-line" :style="{ 'background-image': generateTrendGradient(kpi.trend) }"></div>
              </div>
              <div class="kpi-details">
                <div class="kpi-target">
                  <span class="label">Objetivo:</span>
                  <span class="value">{{ kpi.target }}{{ kpi.unit }}</span>
                </div>
                <div class="kpi-trend" :class="kpi.trend >= 0 ? 'positive' : 'negative'">
                  <span class="icon">{{ kpi.trend >= 0 ? '↑' : '↓' }}</span>
                  <span class="value">{{ Math.abs(kpi.trend) }}%</span>
                </div>
              </div>
              <div class="kpi-description">{{ kpi.description }}</div>
            </div>
          </div>
          
          <!-- Gráficos detallados de Negocio -->
          <div class="chart-row">
            <div class="chart-container large">
              <ApexLineRT 
                title="Ingresos por Suscripción (€)"
                :min="0"
                :max="2000"
                :data="suscripcionesData"
                :labels="meses"
                color="#3b82f6"
                :kpiTarget="2000"
              />
            </div>
            <div class="chart-container large">
              <BusinessChartJSLineAreaRT 
                chartType="line" 
                title="Crecimiento de Usuarios Activos Mensuales" 
                color="#10b981"
                :min="0"
                :max="2000"
                :data="usuariosActivosData"
                :labels="meses"
                :kpiTarget="1500"
              />
            </div>
          </div>
          
          <div class="chart-row">
            <div class="chart-container large">
              <EchartsPie 
                title="Distribución de Usuarios por País"
                :data="paisesData"
              />
            </div>
            <div class="chart-container large">
              <BusinessChartJSLineAreaRT 
                chartType="bar" 
                title="Tiempo Medio de Uso Diario (minutos)" 
                color="#3b82f6"
                :min="0"
                :max="60"
                :data="tiempoUsoData"
                :labels="meses"
                :kpiTarget="45"
              />
            </div>
          </div>
        </div>
        
        <!-- Sección de KPIs Técnicos -->
        <div class="kpi-section technical-section">
          <h2 class="section-title">KPIs Técnicos</h2>
          <div class="kpi-grid">
            <div class="kpi-card" v-for="(kpi, index) in technicalKpis" :key="'tech-'+index">
              <div class="kpi-header">
                <h3 class="kpi-name">{{ kpi.name }}</h3>
                <div class="kpi-status" :class="kpi.status">{{ kpi.statusText }}</div>
              </div>
              <div class="kpi-value-container">
                <div class="kpi-value">{{ kpi.value }}</div>
                <div class="kpi-unit">{{ kpi.unit }}</div>
              </div>
              <div class="kpi-chart">
                <ApexLineRT 
                  v-if="kpi.chartData"
                  :min="kpi.chartMin"
                  :max="kpi.chartMax"
                  :data="kpi.chartData"
                  :labels="timeLabels"
                  :color="kpi.chartColor"
                  :showAxis="false"
                  :showLegend="false"
                  height="60px"
                />
                <div v-else class="trend-line" :style="{ 'background-image': generateTrendGradient(kpi.trend) }"></div>
              </div>
              <div class="kpi-details">
                <div class="kpi-target">
                  <span class="label">Objetivo:</span>
                  <span class="value">{{ kpi.target }}{{ kpi.unit }}</span>
                </div>
                <div class="kpi-trend" :class="kpi.trend >= 0 ? (kpi.inverse ? 'negative' : 'positive') : (kpi.inverse ? 'positive' : 'negative')">
                  <span class="icon">{{ kpi.trend >= 0 ? (kpi.inverse ? '↑' : '↓') : (kpi.inverse ? '↓' : '↑') }}</span>
                  <span class="value">{{ Math.abs(kpi.trend) }}%</span>
                </div>
              </div>
              <div class="kpi-description">{{ kpi.description }}</div>
            </div>
          </div>
          
          <!-- Gráficos detallados de Técnicos -->
          <div class="chart-row">
            <div class="chart-container full-width">
              <LiveServerMetrics 
                title="Métricas del Servidor en Tiempo Real"
                :maxDataPoints="60"
              />
            </div>
          </div>
          
          <div class="chart-row">
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
            <div class="chart-container large">
              <ApexLineRT 
                title="Latencia de la API (ms)"
                :min="0"
                :max="500"
                :data="apiLatencyData"
                :labels="timeLabels"
                color="#3b82f6"
              />
            </div>
          </div>
        </div>

        <!-- Resumen de metas -->
        <div class="kpi-summary">
          <h2 class="section-title">Resumen de Metas</h2>
          <div class="summary-container">
            <div class="summary-stats">
              <div class="stat-card">
                <div class="stat-value">{{ kpisMeta.completed }}</div>
                <div class="stat-label">Completados</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ kpisMeta.inProgress }}</div>
                <div class="stat-label">En Progreso</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ kpisMeta.atRisk }}</div>
                <div class="stat-label">En Riesgo</div>
              </div>
            </div>
            <div class="progress-summary">
              <div class="progress-container">
                <div class="progress-bar">
                  <div class="progress-segment completed" :style="{ width: `${(kpisMeta.completed / kpisMeta.total) * 100}%` }"></div>
                  <div class="progress-segment in-progress" :style="{ width: `${(kpisMeta.inProgress / kpisMeta.total) * 100}%` }"></div>
                  <div class="progress-segment at-risk" :style="{ width: `${(kpisMeta.atRisk / kpisMeta.total) * 100}%` }"></div>
                </div>
                <div class="progress-label">{{ Math.round((kpisMeta.completed / kpisMeta.total) * 100) }}% de objetivos completados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { ref, computed } from 'vue';
import ApexLineRT from '@/components/ApexLineRT.vue';
import BusinessChartJSLineAreaRT from '@/components/BusinessChartJSLineAreaRT.vue';
import TechnicalChartJSLineAreaRT from '@/components/TechnicalChartJSLineAreaRT.vue';
import LiveServerMetrics from '@/components/LiveServerMetrics.vue';
import EchartsPie from '@/components/EchartsPie.vue';

// Configuración de tiempo
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const timeLabels = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setHours(date.getHours() - (11 - i));
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
});

// KPIs de Negocio con datos para gráficos
const businessKpis = ref([
  {
    name: 'Tasa de Conversión',
    value: 8.7,
    unit: '%',
    target: 10,
    trend: 2.5,
    status: 'warning',
    statusText: 'En Progreso',
    description: 'Porcentaje de usuarios que realizan una compra tras visitar la app',
    chartData: [7.5, 7.8, 8.0, 8.2, 8.3, 8.5, 8.6, 8.7, 8.7, 8.6, 8.7, 8.7],
    chartMin: 5,
    chartMax: 12,
    chartColor: '#8b5cf6'
  },
  {
    name: 'Ingresos por Usuario',
    value: 24.50,
    unit: '€',
    target: 22,
    trend: 3.8,
    status: 'success',
    statusText: 'Superado',
    description: 'Promedio de gasto por usuario activo mensual',
    chartData: [22.0, 22.5, 23.0, 23.5, 23.8, 24.0, 24.2, 24.3, 24.4, 24.5, 24.5, 24.5],
    chartMin: 20,
    chartMax: 30,
    chartColor: '#10b981'
  },
  {
    name: 'Retención de Clientes',
    value: 78.3,
    unit: '%',
    target: 85,
    trend: -1.2,
    status: 'warning',
    statusText: 'En Riesgo',
    description: 'Porcentaje de usuarios que siguen activos 30 días después',
    chartData: [80.0, 79.5, 79.0, 78.8, 78.6, 78.5, 78.4, 78.3, 78.3, 78.2, 78.3, 78.3],
    chartMin: 75,
    chartMax: 85,
    chartColor: '#ef4444'
  },
  {
    name: 'Satisfacción de Usuarios',
    value: 4.2,
    unit: '/5',
    target: 4.5,
    trend: 0.3,
    status: 'warning',
    statusText: 'En Progreso',
    description: 'Valoración media de los usuarios en app stores',
    chartData: [4.0, 4.1, 4.1, 4.1, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2],
    chartMin: 3.5,
    chartMax: 5,
    chartColor: '#f59e0b'
  },
  {
    name: 'Cuota de Mercado',
    value: 12.5,
    unit: '%',
    target: 15,
    trend: 1.7,
    status: 'warning',
    statusText: 'En Progreso',
    description: 'Porcentaje del mercado que captura la app',
    chartData: [11.0, 11.5, 12.0, 12.2, 12.3, 12.4, 12.4, 12.5, 12.5, 12.5, 12.5, 12.5],
    chartMin: 10,
    chartMax: 20,
    chartColor: '#3b82f6'
  }
]);

// KPIs Técnicos con datos para gráficos
const technicalKpis = ref([
  {
    name: 'Uso de CPU',
    value: 68,
    unit: '%',
    target: 60,
    trend: 5,
    status: 'warning',
    statusText: 'En Riesgo',
    inverse: true,
    description: 'Uso máximo de CPU en horario de alta demanda',
    chartData: [60, 62, 64, 65, 66, 67, 67, 68, 68, 67, 68, 68],
    chartMin: 50,
    chartMax: 100,
    chartColor: '#ef4444'
  },
  {
    name: 'Tiempo de Respuesta',
    value: 280,
    unit: 'ms',
    target: 300,
    trend: -7,
    status: 'success',
    statusText: 'Óptimo',
    inverse: true,
    description: 'Tiempo promedio de respuesta de la API',
    chartData: [300, 295, 290, 288, 285, 283, 282, 281, 280, 280, 280, 280],
    chartMin: 250,
    chartMax: 350,
    chartColor: '#10b981'
  },
  {
    name: 'Tasa de Fallos',
    value: 1.7,
    unit: '%',
    target: 2,
    trend: -5,
    status: 'success',
    statusText: 'Óptimo',
    inverse: true,
    description: 'Porcentaje de solicitudes que resultan en error',
    chartData: [2.0, 1.9, 1.9, 1.8, 1.8, 1.8, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7],
    chartMin: 1,
    chartMax: 3,
    chartColor: '#10b981'
  },
  {
    name: 'Disponibilidad',
    value: 99.95,
    unit: '%',
    target: 99.9,
    trend: 0.02,
    status: 'success',
    statusText: 'Superado',
    description: 'Porcentaje de tiempo que el servicio está operativo',
    chartData: [99.9, 99.91, 99.92, 99.93, 99.94, 99.94, 99.94, 99.95, 99.95, 99.95, 99.95, 99.95],
    chartMin: 99.8,
    chartMax: 100,
    chartColor: '#10b981'
  },
  {
    name: 'Tamaño de la App',
    value: 48.5,
    unit: 'MB',
    target: 50,
    trend: -3,
    status: 'success',
    statusText: 'Óptimo',
    inverse: true,
    description: 'Tamaño de la aplicación instalada',
    chartData: [50.0, 49.8, 49.5, 49.3, 49.0, 48.8, 48.7, 48.6, 48.5, 48.5, 48.5, 48.5],
    chartMin: 45,
    chartMax: 55,
    chartColor: '#10b981'
  }
]);

// Datos para gráficos de negocio
const usuariosActivosData = ref([500, 600, 700, 800, 900, 1000, 1100, 1900, 1500, 1400, 1500, 1600]);
const suscripcionesData = ref([1000, 1200, 900, 1600, 1900, 1700, 1230, 1500, 800, 900, 1500, 2000]);
const tiempoUsoData = ref([250, 200, 240, 320, 350, 400, 200, 369, 123, 346, 790, 550]);
const paisesData = ref([
  { name: 'México', value: 954, itemStyle: { color: '#ff4d4d' } },
  { name: 'Arabia Saudita', value: 900, itemStyle: { color: '#4dff4d' } },
  { name: 'España', value: 753, itemStyle: { color: '#4d4dff' } },
  { name: 'Italia', value: 680, itemStyle: { color: '#ffff4d' } },
  { name: 'Francia', value: 600, itemStyle: { color: '#ff4dff' } },
  { name: 'Estados Unidos', value: 500, itemStyle: { color: '#4dffff' } },
  { name: 'Canadá', value: 500, itemStyle: { color: '#ff804d' } },
  { name: 'Australia', value: 400, itemStyle: { color: '#804dff' } },
  { name: 'Brazil', value: 400, itemStyle: { color: '#ff4d80' } },
  { name: 'Otros', value: 1000, itemStyle: { color: '#808080' } }
]);

// Datos para gráficos técnicos
const systemResourcesData = ref([65, 68, 72, 70, 75, 68, 72, 70, 65, 68, 72, 70]);
const apiLatencyData = ref([280, 290, 275, 285, 270, 265, 280, 290, 275, 285, 270, 265]);

// Estadísticas de meta
const kpisMeta = computed(() => {
  const combined = [...businessKpis.value, ...technicalKpis.value];
  const completed = combined.filter(kpi => kpi.status === 'success').length;
  const atRisk = combined.filter(kpi => kpi.status === 'danger').length;
  const inProgress = combined.filter(kpi => kpi.status === 'warning').length;
  
  return {
    total: combined.length,
    completed,
    inProgress,
    atRisk
  };
});

// Generar gradiente para tendencia
const generateTrendGradient = (trend: number) => {
  if (trend > 0) {
    return 'linear-gradient(90deg, #10b981 0%, rgba(16, 185, 129, 0.2) 100%)';
  } else if (trend < 0) {
    return 'linear-gradient(90deg, #ef4444 0%, rgba(239, 68, 68, 0.2) 100%)';
  } else {
    return 'linear-gradient(90deg, #f59e0b 0%, rgba(245, 158, 11, 0.2) 100%)';
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: 1500px;
  margin: 0 auto;
  margin-top: 56px;
  overflow: auto;
  height: calc(100vh - 56px);
  box-sizing: border-box;
  background: linear-gradient(135deg, #2e1065 0%, #4c1d95 100%);
  position: relative;
}

.section-title {
  color: white;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.kpi-status {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
}

.kpi-status.success {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.kpi-status.warning {
  background-color: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.kpi-status.danger {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.kpi-value-container {
  display: flex;
  align-items: baseline;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f172a;
}

.kpi-unit {
  font-size: 1rem;
  color: #64748b;
  margin-left: 0.25rem;
}

.kpi-chart {
  height: 60px;
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
  overflow: hidden;
}

.trend-line {
  height: 30px;
  border-radius: 4px;
}

.kpi-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-target {
  font-size: 0.85rem;
  color: #64748b;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.kpi-trend.positive {
  color: #10b981;
}

.kpi-trend.negative {
  color: #ef4444;
}

.kpi-description {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
}

.dashboard-header {
  --background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
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

.kpi-summary {
  margin-top: 1rem;
}

.summary-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.summary-stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
}

.progress-summary {
  padding: 0 2rem;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  height: 12px;
  background-color: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
}

.progress-segment {
  height: 100%;
}

.progress-segment.completed {
  background-color: #10b981;
}

.progress-segment.in-progress {
  background-color: #f59e0b;
}

.progress-segment.at-risk {
  background-color: #ef4444;
}

.progress-label {
  font-size: 0.9rem;
  color: #0f172a;
  text-align: center;
  font-weight: 500;
}

.chart-row {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
}

.chart-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chart-container.large {
  flex: 1;
  min-width: calc(50% - 0.5rem);
  height: 300px;
}

.chart-container.full-width {
  width: 100%;
  height: 300px;
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .chart-row {
    flex-direction: column;
  }
  
  .chart-container.large {
    width: 100%;
    min-width: 100%;
  }
}
</style>