import { v4 } from 'uuid'

export default class DomainObject {
  id: string = v4()
}
