import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { FileDetails } from './main-pdf/pageImages';

@Injectable({
  providedIn: 'root'
})
export class DocMetaDataService {

  private fixed= new BehaviorSubject<FileDetails>(undefined);
  fixed$ = this.fixed.asObservable();

  constructor() { }

  updateFixedValue(value: FileDetails) {
    this.fixed.next(value);
    console.log('fixed changed', value);
}
}
