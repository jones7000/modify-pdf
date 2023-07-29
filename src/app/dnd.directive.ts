import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {

  constructor() { }

  @HostBinding('class.fileover') fileOver: boolean;

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    //evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    //evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    //evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

}
