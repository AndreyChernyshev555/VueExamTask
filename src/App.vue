<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentRouteName = computed(() => router.currentRoute.value.name as string)
</script>

<template>
  <q-layout class="page" view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-toolbar-title>Exam Task</q-toolbar-title>
        <q-space />
        <q-tabs :model-value="currentRouteName" shrink stretch>
          <q-route-tab name="main" label="Таблица поездок" />
          <q-route-tab name="trip" label="Планировка" />
        </q-tabs>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
#app {
  margin: 0;
  padding: 0;
}
.page {
  margin: 0;
  padding: 0;
  width: 100vw;
}
</style>
