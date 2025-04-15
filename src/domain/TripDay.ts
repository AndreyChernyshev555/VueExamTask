import DomainObject from './DomainObject'
import TripEvent from './TripEvent'

export default class TripDay extends DomainObject {
  date: string = ''
  events: TripEvent[] = []

  constructor(tripDay?: TripDay) {
    super(tripDay)
    if (!tripDay) return

    this.date = tripDay.date
    this.events = tripDay.events ? tripDay.events.map((event) => new TripEvent(event)) : []
  }
}
