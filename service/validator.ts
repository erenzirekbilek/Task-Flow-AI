export class Validator {
  static isValidCompanyName(name: string): boolean {
    return name && name.trim().length >= 2 && name.length <= 100;
  }

  static isValidMetroStation(station: string): boolean {
    return station && station.trim().length >= 2 && station.length <= 50;
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}