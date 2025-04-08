export default class Utils {
  static dateInLocaleFormat(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Intl.DateTimeFormat('ru', options).format(new Date(date.split('/').join('-')))
  }

  static strToDate(str: string): Date {
    return new Date(str.split('/').join('-'))
  }
}
