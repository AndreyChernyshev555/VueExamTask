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
    super()
    if (!trip) return

    this.id = trip.id
    this.name = trip.name
    this.startDate = trip.startDate
    this.endDate = trip.endDate
    this.destination = trip.destination
  }
}
