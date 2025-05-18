<template>
  <div class="custom-progress-container">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="progress-bars">
      <div v-for="(item, index) in data" :key="index" class="progress-item">
        <div class="progress-info">
          <span class="progress-label">{{ item.label }}</span>
          <span class="progress-value">{{ item.value }}{{ unit }}</span>
        </div>
        <div class="progress-track">
          <div 
            class="progress-bar" 
            :style="{ 
              width: `${(item.value / maxValue) * 100}%`,
              backgroundColor: colorGradient(index)
            }"
          ></div>
          <div 
            v-if="showTarget && item.target" 
            class="target-marker"
            :style="{ left: `${(item.target / maxValue) * 100}%` }"
          >
            <div class="target-line"></div>
            <div class="target-value">{{ item.target }}{{ unit }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

interface ProgressItem {
  label: string;
  value: number;
  target?: number;
}

const props = defineProps({
  title: {
    type: String,
    default: 'Progreso'
  },
  data: {
    type: Array as () => ProgressItem[],
    required: true
  },
  maxValue: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: '%'
  },
  baseColor: {
    type: String,
    default: '#3b82f6'
  },
  showTarget: {
    type: Boolean,
    default: true
  }
});

const colorGradient = (index: number) => {
  // Generamos variaciones del color base
  const colors = [
    props.baseColor,
    '#60a5fa',
    '#93c5fd',
    '#bfdbfe',
    '#2563eb'
  ];
  
  return colors[index % colors.length];
};
</script>

<style scoped>
.custom-progress-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e293b;
  text-align: center;
}

.progress-bars {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.progress-label {
  font-weight: 500;
  color: #334155;
}

.progress-value {
  font-weight: 600;
  color: #0f172a;
}

.progress-track {
  height: 12px;
  background-color: #e2e8f0;
  border-radius: 6px;
  overflow: visible;
  position: relative;
}

.progress-bar {
  height: 100%;
  border-radius: 6px;
  transition: width 1s ease-in-out;
  position: relative;
  animation: fillAnimation 1.5s ease-out;
}

.target-marker {
  position: absolute;
  top: -10px;
  transform: translateX(-50%);
  z-index: 10;
}

.target-line {
  width: 2px;
  height: 32px;
  background-color: #ef4444;
  position: relative;
}

.target-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #ef4444;
  white-space: nowrap;
}

@keyframes fillAnimation {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style> 