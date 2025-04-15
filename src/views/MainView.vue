<template>
  <div class="main-page">
    <q-table
      table-class="trip-table-colors"
      card-class="trip-table-colors"
      title="Поездки"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template #body="props">
        <q-tr :props="props" class="text-right">
          <q-td v-for="col in props.cols" :key="col.name">
            <div v-if="col.name !== 'actions'">{{ col.value }}</div>
            <q-btn
              v-else
              flat
              rounded
              dense
              icon="more_vert"
              @click="onRowContextMenu($event, props.row)"
            >
              <q-menu anchor="bottom left" color="brown-10">
                <q-list style="min-width: 150px">
                  <q-item clickable @click="onEdit" v-close-popup>
                    <q-item-section>Редактировать</q-item-section>
                  </q-item>
                  <q-item clickable @click="onEventsOpen" v-close-popup>
                    <q-item-section>Открыть события</q-item-section>
                  </q-item>
                  <q-item clickable @click="onDelete" v-close-popup>
                    <q-item-section>Удалить</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div>
      <q-btn
        style="width: 100%"
        label="Добавить поездку"
        color="primary"
        text-color="brown-10"
        @click="onAdd"
      />
    </div>

    <q-dialog v-model="showDialog" class="dialog-window">
      <q-card class="dialog-card" color="primary">
        <q-card-section>
          <div class="text-h6">Редактирование поездки</div>
        </q-card-section>
        <q-card-section>
          <q-form ref="tripForm">
            <q-input
              class="q-mb-md"
              label="Название"
              v-model="selectedRow.name"
              :rules="[(val) => !!val || 'Обязательное поле']"
            />
            <div class="row justify-center">
              <div class="q-mb-md">
                <div class="q-mb-sm date-title">Дата начала</div>
                <q-date
                  label="Дата начала"
                  color="brown-10"
                  text-color="primary"
                  minimal
                  flat
                  bordered
                  v-model="selectedRow.startDate"
                />
              </div>
              <div style="width: 10px">{{ ' ' }}</div>
              <div class="q-mb-md">
                <div class="q-mb-sm date-title">Дата окончания</div>
                <q-date
                  label="Дата окончания"
                  color="brown-10"
                  text-color="primary"
                  minimal
                  flat
                  bordered
                  v-model="selectedRow.endDate"
                />
              </div>
            </div>
            <q-input
              label="Город/страна"
              v-model="selectedRow.destination"
              :rules="[(val) => !!val || 'Обязательное поле']"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Сохранить" class="dialog-button" color="brown-10" @click="saveRow" />
          <q-btn flat label="Отмена" class="dialog-button" color="brown-10" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <AlertDialog v-model="alert" :error-message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import AlertDialog from '@/components/AlertDialog.vue'
import { QForm } from 'quasar'
import { onMounted, ref } from 'vue'
import Trip from '../domain/Trip'
import { useTripStore } from '@/stores/trip'
import { useRouter } from 'vue-router'
import Utils from '@/domain/Utils'

// use
const store = useTripStore()
const router = useRouter()

// refs
const alert = ref<boolean>(false)
const errorMessage = ref<string>('')
const tripForm = ref(QForm)
const rows = ref<Trip[]>([] as Trip[])
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
  { name: 'actions', label: 'Действия', field: 'actions' },
]

// methods
const onRowContextMenu = (evt: Event, row: Trip) => {
  selectedRow.value = new Trip(row)
}

const onAdd = () => {
  selectedRow.value = new Trip()
  showDialog.value = true
}

const onEdit = () => {
  showDialog.value = true
}

const onEventsOpen = () => {
  const openingTrip = selectedRow.value
  if (openingTrip.days?.length == 0) openingTrip.calculateTripDays()
  store.setActualTrip(selectedRow.value)
  router.push({ name: 'trip' })
}

const onDelete = () => {
  rows.value.splice(
    rows.value.findIndex((row) => row.id === selectedRow.value.id),
    1,
  )
  store.setTrips(rows.value)
}

const saveRow = () => {
  tripForm.value?.validate().then((success: boolean) => {
    if (!success) return
    if (Utils.strToDate(selectedRow.value.endDate) < Utils.strToDate(selectedRow.value.startDate)) {
      alert.value = true
      errorMessage.value = 'Дата окончания не может быть раньше даты начала'
      return
    }
    selectedRow.value.calculateTripDays()
    const existingIndex = rows.value.findIndex((row) => row.id === selectedRow.value.id)
    const newTrip = new Trip(selectedRow.value)
    if (existingIndex !== -1) rows.value[existingIndex] = newTrip
    else rows.value.push(newTrip)
    showDialog.value = false
    store.setTrips(rows.value)
    store.setActualTrip(newTrip)
    selectedRow.value = new Trip()
    router.push({ name: 'trip' })
  })
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
::v-deep(.trip-table-colors) {
  background-color: #3e2723;
  color: #faddbf;
}
.dialog-window {
  background-color: rgba(0, 0, 0, 0.9);
}
.dialog-card {
  max-width: 35vw;
  min-width: 35vw;
  background: #faddbf;
  color: #3e2723;
}
.date-title {
  text-align: center;
  font-size: 1.5em;
}
.table-menu {
  background-color: #faddbf;
  color: #3e2723;
}
</style>
