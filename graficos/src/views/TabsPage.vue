<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="business" href="/tabs/business">
          <ion-icon :icon="trendingUp"></ion-icon>
          <ion-label>Negocio</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="technical" href="/tabs/technical">
          <ion-icon :icon="hardwareChip"></ion-icon>
          <ion-label>Técnico</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="kpis" href="/tabs/kpis">
          <ion-icon :icon="speedometer"></ion-icon>
          <ion-label>KPIs</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/vue';
import { trendingUp, hardwareChip, speedometer } from 'ionicons/icons';
</script>

<style scoped>
ion-tab-bar {
  --background: #1E1E1E;
  --color: #666666;
  --color-selected: #3b82f6;
  --border: none;
}

ion-tab-button {
  --ripple-color: transparent;
}
</style> 