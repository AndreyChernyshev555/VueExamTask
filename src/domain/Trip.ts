import DomainObject from './DomainObject'
import TripDay from './TripDay'

export default class Trip extends DomainObject {
  /**
   * Название
   */
  name: string = ''
  /**
   * Дата начала поездки
   */
  startDate: string = ''
  /**
   * Дата окончания поездки
   */
  endDate: string = ''
  /**
   * Город/страна
   */
  destination: string = ''
  /**
   * Дни поездки
   */
  days: TripDay[] = []

  constructor(trip?: Trip) {
    super(trip)
    if (!trip) return

    this.id = trip.id
    this.name = trip.name
    this.startDate = trip.startDate
    this.endDate = trip.endDate
    this.destination = trip.destination
    this.days = trip.days ? trip.days.map((day) => new TripDay(day)) : []
  }

  calculateTripDays(oldDays?: TripDay[]) {
    const result = []
    const startDate = new Date(this.startDate.split('/').join('-'))
    const endDate = new Date(this.endDate.split('/').join('-'))
    for (let i = new Date(startDate); i <= endDate; i.setDate(i.getDate() + 1)) {
      const newDate = new Date(i)
      result.push(`${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}`)
    }
    this.days = result.map((d) => {
      if (oldDays) {
        const oldDay = oldDays.find((day) => day.date === d)
        if (oldDay) return oldDay
      }
      const tripDay = new TripDay()
      tripDay.date = d
      return tripDay
    })
  }
}
