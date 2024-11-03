import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customeDate'
})
export class CustomeDatePipe implements PipeTransform {
  transform(date: string): unknown {
    if(date == null) return '';
    date = date.slice(0,-1);
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'medium');
  }

}
