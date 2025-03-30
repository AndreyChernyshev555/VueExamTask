<template>
  <div class="main-page">
    <q-table
      class="trip-table"
      title="Поездки"
      :rows="rows"
      :columns="columns"
      row-key="name"
      @row-contextmenu="onRowContextMenu"
    />

    <div>
      <q-btn :style="{ width: '100%' }" label="Добавить поездку" color="primary" @click="onAdd" />
    </div>

    <q-menu v-model="contextMenu.show" :position="contextMenu.position" context-menu>
      <q-list style="min-width: 150px">
        <q-item clickable @click="onEdit">
          <q-item-section>Редактировать</q-item-section>
        </q-item>
        <q-item clickable @click="onDelete">
          <q-item-section>Удалить</q-item-section>
        </q-item>
      </q-list>
    </q-menu>

    <q-dialog v-model="showDialog">
      <q-card class="dialog-card">
        <q-card-section>
          <div class="text-h6">Редактирование поездки</div>
        </q-card-section>
        <q-card-section>
          <q-input label="Название" v-model="selectedRow.name" />
          <q-date
            label="Дата начала"
            color="secondary"
            v-model="selectedRow.startDate"
            @change="() => (dateChanged = true)"
          />
          <q-date
            label="Дата окончания"
            color="secondary"
            v-model="selectedRow.endDate"
            @change="() => (dateChanged = true)"
          />
          <q-input label="Город/страна" v-model="selectedRow.destination" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Сохранить" class="dialog-button" color="secondary" @click="saveRow" />
          <q-btn flat label="Отмена" class="dialog-button" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Trip from '../domain/Trip'
import { useTripStore } from '@/stores/trip'
import { useRouter } from 'vue-router'
import Utils from '@/domain/Utils'

// use
const store = useTripStore()
const router = useRouter()

// refs
const rows = ref<Trip[]>([] as Trip[])
const dateChanged = ref<boolean>(false)
const contextMenu = ref<{ show: boolean; position: object }>({
  show: false,
  position: { top: 0, left: 0 },
})
const selectedRow = ref<Trip>(new Trip())
const showDialog = ref<boolean>(false)

// properties
const columns = [
  { name: 'name', label: 'Название', field: 'name' },
  {
    name: 'startDate',
    label: 'Дата начала',
    field: (row: Trip) => Utils.dateInLocaleFormat(row.startDate),
  },
  {
    name: 'endDate',
    label: 'Дата окончания',
    field: (row: Trip) => Utils.dateInLocaleFormat(row.endDate),
  },
  { name: 'destination', label: 'Город/страна', field: 'destination' },
]

// methods
const onRowContextMenu = (evt: Event, row: Trip, index: number) => {
  if (!row) return
  evt.preventDefault()
  const mouseEvt = evt as MouseEvent
  contextMenu.value.show = true
  contextMenu.value.position = { top: mouseEvt.clientY, left: mouseEvt.clientX }
  selectedRow.value = row
}

const onAdd = () => {
  selectedRow.value = new Trip()
  showDialog.value = true
}

const onEdit = () => {
  contextMenu.value.show = false
  showDialog.value = true
}

const onDelete = () => {
  contextMenu.value.show = false
  rows.value.splice(
    rows.value.findIndex((row) => row.id === selectedRow.value.id),
    1,
  )
  store.setTrips(rows.value)
}

const saveRow = () => {
  if (dateChanged.value) selectedRow.value.calculateTripDays()
  const existingIndex = rows.value.findIndex((row) => row.id === selectedRow.value.id)
  if (existingIndex !== -1) rows.value[existingIndex] = new Trip(selectedRow.value)
  else rows.value.push(new Trip(selectedRow.value))
  showDialog.value = false
  store.setTrips(rows.value)
  store.setActualTrip(selectedRow.value)
  selectedRow.value = new Trip()
  dateChanged.value = false
  router.push({ name: 'trip' })
}

// hooks
onMounted(() => {
  const storedTrips = store.getTrips
  if (!storedTrips || storedTrips.length === 0) rows.value = []
  else rows.value = store.getTrips
})
</script>

<style scoped>
.main-page {
  padding: 5vw;
}
.trip-table {
  width: 100%;
  height: 100%;
}
.dialog-card {
  max-width: 50vw;
  min-width: 50vw;
}
</style>
