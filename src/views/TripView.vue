<template>
  <div>
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      control-color="black"
      padding
      arrows
      height="100%"
      class="q-pa-md row flex-center event-carousel"
    >
      <q-carousel-slide
        v-for="index in tripDays.length"
        :key="index"
        :name="tripDays[index - 1].date"
      >
        <q-card class="q-mb-md day-card">
          <q-card-section>
            <div class="slide-title">
              {{ `День ${index} - ${Utils.dateInLocaleFormat(tripDays[index - 1].date)}` }}
            </div>
          </q-card-section>
          <q-card-section>
            <div v-for="tripEvent in tripDays[index - 1].events">
              <div>{{ tripEvent.getEventMainText() }}</div>
              <div v-if="tripEvent.location">{{ `Место: ${tripEvent.location}` }}</div>
              <div v-if="tripEvent.desciption">{{ `Описание: ${tripEvent.desciption}` }}</div>
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Добавить событие"
              class="dialog-button"
              color="secondary"
              @click="onAdd(index - 1)"
            />
          </q-card-actions>
        </q-card>
      </q-carousel-slide>
    </q-carousel>
    <q-dialog v-model="showDialog">
      <q-card class="dialog-card">
        <q-card-section>
          <div class="text-h6">Создание события</div>
        </q-card-section>
        <q-card-section class="dialog-card-form">
          <q-input v-model="editedEvent.title" label="Название" />
          <div class="time-picker">
            <q-time v-model="editedEvent.time" label="Время" />
          </div>
          <q-input v-model="editedEvent.location" label="Место" />
          <q-input v-model="editedEvent.desciption" label="Описание" type="textarea" />
          <EmojiPicker :native="true" @select="onSelectEmoji" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Сохранить"
            class="dialog-button"
            color="secondary"
            @click="onSaveEvent"
          />
          <q-btn flat label="Отмена" class="dialog-button" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { onBeforeMount, ref } from 'vue'
import { useTripStore } from '@/stores/trip'
import { useRouter } from 'vue-router'
import Trip from '@/domain/Trip'
import TripEvent from '@/domain/TripEvent'
import Utils from '@/domain/Utils'
import TripDay from '@/domain/TripDay'

// use
const store = useTripStore()
const router = useRouter()

// refs
const actualTrip = ref<Trip>(store.getActualTrip)
const slide = ref<string>('')
const showDialog = ref<boolean>(false)
const dayIndex = ref<number>(0)
const editedEvent = ref<TripEvent>(new TripEvent())

// computed
const tripDays = ref<TripDay[]>([])

// properties
const columns = [
  { name: 'time', label: 'Время', field: 'time' },
  { name: 'title', label: 'Событие', field: 'title' },
  { name: 'location', label: 'Место', field: 'location' },
  { name: 'description', label: 'Описание', field: 'description' },
]

// methods
const calculateTripDays = () => {
  const result = []
  const startDate = new Date(actualTrip.value.startDate.split('/').join('-'))
  const endDate = new Date(actualTrip.value.endDate.split('/').join('-'))
  for (let i = new Date(startDate); i <= endDate; i.setDate(i.getDate() + 1)) {
    const newDate = new Date(i)
    result.push(`${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}`)
  }
  tripDays.value = result.map((d) => {
    const tripDay = new TripDay()
    tripDay.date = d
    return tripDay
  })
}

const onAdd = (index: number) => {
  dayIndex.value = index
  showDialog.value = true
}
const onSelectEmoji = (e: { i: string }) => {
  editedEvent.value.icon = e.i
}
const onSaveEvent = () => {
  tripDays.value[dayIndex.value].events.push(editedEvent.value)
  console.log(tripDays.value)
  showDialog.value = false
}

// hooks
onBeforeMount(() => {
  calculateTripDays()
  if (tripDays.value.length === 0) router.push({ name: 'main' })
  slide.value = tripDays.value[0].date
})
</script>

<style scoped>
.day-card {
  width: 30vw;
}
.event-carousel {
  margin-top: 20vh;
}
.slide-title {
  font-size: 2em;
  text-align: center;
}
.dialog-card {
  max-width: 50vw;
  min-width: 50vw;
}
.dialog-card-form {
  display: flex;
  flex-direction: column;
  gap: 2vh;
}
.time-picker {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
