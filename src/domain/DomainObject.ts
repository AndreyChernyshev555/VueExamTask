import { v4 } from 'uuid'

export default class DomainObject {
  id: string = ''

  constructor(obj?: DomainObject) {
    if (obj) this.id = obj.id
    else this.id = v4()
  }
}
