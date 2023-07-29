import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileDetails } from '../main-pdf/pageImages';
import { DocMetaDataService } from '../doc-meta-data.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  files: FileDetails[];
  selectedFile: FileDetails;
  subscription: Subscription;

  nameControl = new FormControl('');

  constructor(
    private sharedService: DocMetaDataService,
    private dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { files: FileDetails[] }
  ) {
    this.files = data.files;
    this.selectedFile = this.files[0];
  }

  /*
  ngOnInit() {
    this.subscription = this.sharedService.fixed$.subscribe(val=>{ this.selectedFile = val; });
}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  } */

  close() {
    this.dialogRef.close();
  }

  save() {
    this.nameControl.markAsTouched();
    if(this.nameControl.valid) {
      this.sharedService.updateFixedValue(this.selectedFile);
      this.dialogRef.close();
    }
  }

  onFileSelect() {
    if (!this.selectedFile.fileName) {
      this.selectedFile.fileName = 'newpdf';
    }
    if (!this.selectedFile.Title) {
      this.selectedFile.Title = '';
    }
    if (!this.selectedFile.Author) {
      this.selectedFile.Author = '';
    }
    if (!this.selectedFile.Subject) {
      this.selectedFile.Subject = '';
    }
    if (!this.selectedFile.Creator) {
      this.selectedFile.Creator = '';
    }
    if (!this.selectedFile.Keywords) {
      this.selectedFile.Keywords = '';
    }
    if (!this.selectedFile.Producer) {
      this.selectedFile.Producer = 'modpdf';
    }
    if (!this.selectedFile.CreationDate) {
      this.selectedFile.CreationDate = null;
    }
  }
}