<template>
  <q-dialog v-model="alert">
    <q-card class="alert-card" color="primary">
      <q-card-section>
        <div class="text-h6">Ошибка</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        {{ errorMessage }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineModel } from 'vue'

const alert = defineModel('alert', { type: Boolean, default: false })
const props = defineProps(['errorMessage'])
</script>

<style scoped>
.alert-card {
  background-color: #3e2723;
  color: #faddbf;
}
</style>
