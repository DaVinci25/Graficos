<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="dashboard-header">
        <ion-title>Dashboard de Negocio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="dashboard-content">
      <div class="dashboard-container">
        <!-- Primera fila: KPIs -->
        <div class="kpi-cards">
          <div class="kpi-card">
            <div class="kpi-value">{{ userConversionRate }}%</div>
            <div class="kpi-title">Tasa de Conversión</div>
            <div class="kpi-trend up">+2.5%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ averageRevenuePerUser }}€</div>
            <div class="kpi-title">Ingreso Medio</div>
            <div class="kpi-trend up">+3.8%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ customerRetentionRate }}%</div>
            <div class="kpi-title">Retención</div>
            <div class="kpi-trend down">-1.2%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ userSatisfaction }}/5</div>
            <div class="kpi-title">Satisfacción</div>
            <div class="kpi-trend up">+0.3</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-value">{{ marketSharePercentage }}%</div>
            <div class="kpi-title">Cuota de Mercado</div>
            <div class="kpi-trend up">+1.7%</div>
          </div>
        </div>

        <!-- Segunda fila: Ingresos y Crecimiento -->
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

        <!-- Tercera fila: Distribución y Tiempo de uso -->
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

        <!-- Cuarta fila: Canales de adquisición -->
        <div class="chart-row">
          <div class="chart-container full-width">
            <ApexStackedBar 
              title="Canales de Adquisición de Clientes"
              :data="canalAdquisicionData"
              :categories="['Q1', 'Q2', 'Q3', 'Q4']"
            />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import BusinessChartJSLineAreaRT from '@/components/BusinessChartJSLineAreaRT.vue';
import ApexLineRT from '@/components/ApexLineRT.vue';
import EchartsPie from '@/components/EchartsPie.vue';
import ApexStackedBar from '@/components/ApexStackedBar.vue';
import CustomProgressChart from '@/components/CustomProgressChart.vue';
import { ref } from 'vue';

// KPI Values
const userConversionRate = ref(8.7);
const averageRevenuePerUser = ref(24.5);
const customerRetentionRate = ref(78.3);
const userSatisfaction = ref(4.5);
const marketSharePercentage = ref(12.5);

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Datos de usuarios activos (KPI: Crecimiento de usuarios)
const usuariosActivosData = ref([500, 600, 700, 800, 900, 1000, 1100, 1900, 1500, 1400, 1500, 1600]);

// Datos de suscripciones (KPI: Ingresos por suscripción)
const suscripcionesData = ref([1000, 1200, 900, 1600, 1900, 1700, 1230, 1500, 800, 900, 1500, 2000]);

// Datos de países (KPI: Distribución geográfica)
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

// Datos de tiempo de uso (KPI: Engagement)
const tiempoUsoData = ref([250, 200, 240, 320, 350, 400, 200, 369, 123, 346, 790, 550]);

// Datos de canales de adquisición (KPI: Eficiencia de marketing)
const canalAdquisicionData = ref({
  'Instagram': [800],
  'TikTok': [600],
  'Twitter': [400]
});

// Datos de progreso personalizado
const progressData = ref([
  { label: 'Abdomen', value: 200, target: 250 },
  { label: 'Pectoral', value: 300, target: 350 },
  { label: 'Espalda', value: 110, target: 150 },
  { label: 'Pierna', value: 400, target: 450 }
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
  border-top: 4px solid #ff4d4d;
  position: relative;
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

.dashboard-header {
  --background: linear-gradient(135deg, #ff4d4d 0%, #ff6b6b 100%);
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