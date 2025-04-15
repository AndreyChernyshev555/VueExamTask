import DomainObject from './DomainObject'

export default class TripEvent extends DomainObject {
  /**
   * Время события
   */
  time: string = ''
  /**
   * Название
   */
  title: string = ''
  /**
   * Местоположение
   */
  location: string = ''
  /**
   * Описание
   */
  desciption: string = ''
  /**
   * Символ
   */
  icon: string = ''

  constructor(tripEvent?: TripEvent) {
    super(tripEvent)
    if (!tripEvent) return

    this.title = tripEvent.title
    this.time = tripEvent.time
    this.location = tripEvent.location
    this.desciption = tripEvent.desciption
    this.icon = tripEvent.icon
  }

  getEventMainText() {
    return `[${this.time}] ${this.icon} ${this.title}`
  }
}
