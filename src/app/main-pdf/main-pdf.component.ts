import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {saveAs} from 'file-saver';
import * as pdfjsLib from 'pdfjs-dist';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FileDetails, PageImages } from './pageImages';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { DocMetaDataService } from '../doc-meta-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-pdf',
  templateUrl: './main-pdf.component.html',
  styleUrls: ['./main-pdf.component.scss']
})
export class MainPdfComponent implements OnInit, OnDestroy {

  filesDetails: FileDetails[] = [];

  debug = true;
  file!: File | null;
  files!: FileList | null;

  spinnerLoadPdf: Boolean = false;
  spinnerSavePdf: Boolean = false;

  pdfBytes: Uint8Array;
  pageImages: PageImages[] = [];
  pages: number[] = [];
  //pdfDocs = [];
  allPdfDocs = [];
  blob = [];
  listView: Boolean = true;
  progress: number;
  cancelled: Boolean = false;

  subscription: Subscription;
  selectedFile: FileDetails = undefined;

  @ViewChildren('imgRef') imgRefs: QueryList<ElementRef>;
  @ViewChildren('containerRef1') containerRefs1: QueryList<ElementRef>;
  @ViewChildren('containerRef2') containerRefs2: QueryList<ElementRef>;
  @ViewChild('myInput')
  myInputVariable: ElementRef;

  constructor(private http: HttpClient, private dialog: MatDialog, private sharedService: DocMetaDataService){}

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pageImages, event.previousIndex, event.currentIndex);
  }

  remove(pageImage: PageImages){
    this.pageImages.forEach((element, index) => {
      if (element.page == pageImage.page && element.fileName == pageImage.fileName) {
        const element = document.getElementsByClassName('example-box')[index];
        element.classList.add('fade-out');
        setTimeout(() => {
        this.pageImages.splice(index,1);
        }, 400);
      }
    })
  }

  cancelLoad():void{
    this.cancelled = true;
  }

  showFileInfo(){
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { files: this.filesDetails },
      width: '60%',
    });
  }

  changeView() {
    this.listView? this.listView = false : this.listView = true;
  }

  scaleImage(factor: string) {
    this.imgRefs.forEach((imgRef: ElementRef, index: number) => {
      const img = imgRef.nativeElement;
      const container1 = this.containerRefs1.toArray()[0].nativeElement;
      // const container2 = this.containerRefs2.toArray()[index].nativeElement;
      const currentWidth = img.offsetWidth;

      if (factor === '+') {
        img.style.width = currentWidth + 30 + 'px';
        //img.style.height = currentHeight * 1.2 + 'px';
        // container1.style.width = currentContainerWidth1 + 20 + 'px';
        // container2.style.width = currentContainerWidth2 * 1.2 + 'px';
      } 
      else if (currentWidth >= 40) {
        img.style.width = currentWidth - 30 + 'px';
        //img.style.height = currentHeight / 1.2 + 'px';
        // container1.style.width = currentContainerWidth1 - 20 + 'px';
        // container2.style.width = currentContainerWidth2 / 1.2 + 'px';
      }
    });
  }

  ngOnInit() {
      /*if (this.debug) {
      this.http.get<PageImages[]>('assets/test.json').subscribe(data => {
        this.pageImages = data;
      });
      }*/

      this.subscription = this.sharedService.fixed$.subscribe(val=>{ this.selectedFile = val; });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClear(){
    this.pageImages = [];
    this.filesDetails = [];
    this.files = null;
    this.file = null;
    this.myInputVariable.nativeElement.value = "";
  }

  // On file Select
  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.files = target.files;
    this.file = this.files[0];

    this.onShow();
  }

  async onSave() {
    this.spinnerSavePdf = true;
    const newPdfDoc = await PDFDocument.create();
      
    for (let i = 0; i < this.pageImages.length; i++) {
      const currentPage = this.pageImages[i].data;
      const copiedPages = await newPdfDoc.copyPages(currentPage.doc, [this.pageImages[i].page]);
      copiedPages.forEach((page) => {
        // newPdfDoc.addPage(page);
        newPdfDoc.insertPage(newPdfDoc.getPageCount(), page);
      });
    }

    let title = 'new-document.pdf';
    if(this.selectedFile) {
      if(this.selectedFile.fileName){
        title = this.selectedFile.fileName;
      }
      if(this.selectedFile.Title) {
        newPdfDoc.setTitle(this.selectedFile.Title);
      }
      if(this.selectedFile.Author) {
        newPdfDoc.setAuthor(this.selectedFile.Author);
      }
      if(this.selectedFile.Subject) {
        newPdfDoc.setSubject(this.selectedFile.Subject);
      }
      if(this.selectedFile.Keywords) {
        newPdfDoc.setKeywords([this.selectedFile.Keywords]);
      }
      if(this.selectedFile.Creator) {
        newPdfDoc.setCreator(this.selectedFile.Creator);
      }
      else {
        newPdfDoc.setCreator("modpdf");
      }
      if(this.selectedFile.Producer) {
        newPdfDoc.setProducer(this.selectedFile.Producer)
      } 

      if(this.selectedFile.CreationDate) {
        newPdfDoc.setCreationDate(this.selectedFile.CreationDate);
      }
    }

    const pdfBytes = await newPdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    saveAs(pdfBlob, title);
    this.spinnerSavePdf = false;
  }

  async onShow() {
    this.cancelled = false;
    this.progress = 0;
    this.spinnerLoadPdf = true;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.js';
    
    const totalFiles = Object.keys(this.files).length;
    let numFilesProcessed = 0;


    Object.keys(this.files).forEach(i => {
      if (this.cancelled) {
        this.spinnerLoadPdf = false;
        return;
      }

      const file = this.files[i];

      const fileReader = new FileReader();
      fileReader.onload = async () => {
        // load to docs
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdfDocX = await PDFDocument.load(typedArray);

        // add meta data to fileDetails array
        this.filesDetails.push({
          fileName: file.name,
          Title: pdfDocX.getTitle(),
          Author: pdfDocX.getAuthor(),
          Subject: pdfDocX.getSubject(),
          Creator: "modpdf",// pdfDocX.getCreator(),                    // TODO: change if there is no pdf-lib creator
          Keywords: pdfDocX.getKeywords(),
          Producer: "modpdf", // pdfDocX.getProducer(),                 // TODO: change to link
          CreationDate: pdfDocX.getCreationDate(),
          ModificationDate: pdfDocX.getModificationDate()
        })

        
        // create pictures
        const pdfDoc = await pdfjsLib.getDocument(typedArray).promise;
        const progressIncrement = 100 / pdfDoc.numPages / this.files.length;
        for (let j = 1; j <= pdfDoc.numPages; j++) {
          if (this.cancelled) {
            this.spinnerLoadPdf = false;
            return;
          }

          const page = await pdfDoc.getPage(j);
          const canvas = document.createElement('canvas');
          const viewport = page.getViewport({ scale: 0.7 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
          };
          
          await page.render(renderContext).promise;
          const imageUrl = canvas.toDataURL('image/png');
          
          this.pageImages.push({page: j-1, url: imageUrl, fileName: file.name, data: pdfDocX.getPage(j-1)});
          this.progress += progressIncrement;
        }

        // increment the count of processed files
        numFilesProcessed++;

        // check if all files have been processed
        if (numFilesProcessed === totalFiles) {
          // all files have been processed, do something here
          console.log('All files have been processed!');
          this.spinnerLoadPdf = false;
        }
      };
      fileReader.readAsArrayBuffer(file);
    })
  }

}
