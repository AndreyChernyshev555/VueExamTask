export default class Utils {
  static dateInLocaleFormat(date: string): string {
    console.log(date)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Intl.DateTimeFormat('ru', options).format(new Date(date.split('/').join('-')))
  }
}
