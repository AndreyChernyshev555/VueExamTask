import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Trip from '@/domain/Trip'

export const useTripStore = defineStore('trip', () => {
  const storedTrips = ref<string>(localStorage.getItem('trips') || '[]')
  const actualTrip = ref<Trip>(new Trip())
  const getTrips = computed(() => {
    return JSON.parse(storedTrips.value)?.map((trip: Trip) => new Trip(trip))
  })
  const getActualTrip = computed(() => {
    return new Trip(actualTrip.value)
  })
  function setTrips(trips: Trip[]) {
    storedTrips.value = JSON.stringify(trips)
    localStorage.setItem('trips', storedTrips.value)
  }
  function setActualTrip(trip: Trip) {
    actualTrip.value = new Trip(trip)
  }

  return { storedTrips, actualTrip, getActualTrip, getTrips, setTrips, setActualTrip }
})
