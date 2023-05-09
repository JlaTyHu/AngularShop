import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cardNumberPipe' })
export class CardNumberPipe implements PipeTransform {
  transform(value: string | number): string {
    value = value.toString();
    let formattedValue = value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
    return formattedValue;
  }
}
