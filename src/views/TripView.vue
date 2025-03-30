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
            <q-list>
              <q-item
                v-for="tripEvent in tripDays[index - 1].events"
                :key="tripEvent.id"
                @click.right="onItemClick($event, tripEvent)"
              >
                <q-item-section>{{ tripEvent.getEventMainText() }}</q-item-section>
                <q-item-section v-if="tripEvent.location">
                  {{ `Место: ${tripEvent.location}` }}
                </q-item-section>
                <q-item-section v-if="tripEvent.desciption">
                  {{ `Описание: ${tripEvent.desciption}` }}
                </q-item-section>
              </q-item>
            </q-list>
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
    <div>
      <q-btn
        :style="{ width: '100%' }"
        label="Сохранить записи"
        color="primary"
        @click="onSaveDays"
      />
    </div>
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

    <q-menu v-model="contextMenu.show" :position="contextMenu.position" context-menu>
      <q-list style="min-width: 150px">
        <q-item clickable @click="onEditEvent">
          <q-item-section>Редактировать</q-item-section>
        </q-item>
        <q-item clickable @click="onDeleteEvent">
          <q-item-section>Удалить</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
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
const contextMenu = ref<{ show: boolean; position: object }>({
  show: false,
  position: { top: 0, left: 0 },
})
const tripDays = ref<TripDay[]>([])

// methods
const onAdd = (index: number) => {
  dayIndex.value = index
  showDialog.value = true
}
const onSelectEmoji = (e: { i: string }) => {
  editedEvent.value.icon = e.i
}
const onSaveEvent = () => {
  const eventIndex = tripDays.value[dayIndex.value].events.findIndex(
    (event) => event.id === editedEvent.value.id,
  )
  if (eventIndex === -1) tripDays.value[dayIndex.value].events.push(editedEvent.value)
  else tripDays.value[dayIndex.value].events[eventIndex] = editedEvent.value
  showDialog.value = false
}
const onItemClick = (evt: Event, tripEvent: TripEvent) => {
  evt.preventDefault()
  const mouseEvt = evt as MouseEvent
  contextMenu.value.show = true
  contextMenu.value.position = { top: mouseEvt.clientY, left: mouseEvt.clientX }
  editedEvent.value = new TripEvent(tripEvent)
}
const onEditEvent = () => {
  contextMenu.value.show = false
  showDialog.value = true
}
const onDeleteEvent = () => {
  contextMenu.value.show = false
  tripDays.value[dayIndex.value].events.splice(
    tripDays.value[dayIndex.value].events.findIndex((event) => event.id === editedEvent.value.id),
    1,
  )
}
const onSaveDays = () => {
  actualTrip.value.days = tripDays.value
  console.log(actualTrip.value)
  store.setActualTrip(actualTrip.value)
  store.saveActualTrip()
  router.push({ name: 'main' })
}

// hooks
onBeforeMount(() => {
  tripDays.value = actualTrip.value.days
  if (tripDays.value.length === 0) {
    router.push({ name: 'main' })
    return
  }
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
