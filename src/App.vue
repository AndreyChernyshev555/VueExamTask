<template>
  <q-layout class="page" view="hHh lpR fFf">
    <q-header class="transparent">
      <q-toolbar class="text-secondary rounded-borders transparent">
        <q-toolbar-title class="page-title" shrink @click="() => router.push({ name: 'main' })">
          Akaanir
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: url('../public/i.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  font-family: 'Ubuntu Sans', sans-serif;
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
.page-title {
  cursor: pointer;
}
.q-date__main {
  background-color: #faddbf !important;
}
.q-date--bordered {
  border: 3px solid #3e2723 !important;
}
.q-time__main {
  background-color: #faddbf !important;
}
.q-menu {
  background-color: #faddbf !important;
  color: #3e2723 !important;
}
.q-select__dropdown-icon {
  color: #faddbf !important;
}
</style>
