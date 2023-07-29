import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, HostListener, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mod-pdf';

  toggleControl = new FormControl(false);

  @HostBinding('class') className = '';

  constructor(private overlay: OverlayContainer) { }
  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }


  /*
  isMobile: boolean;
  fontSize: number = 16;

  constructor(private breakpointObserver: BreakpointObserver, private renderer: Renderer2) {}

  ngOnInit() {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = this.breakpointObserver.isMatched('(max-width: 600px)');
    this.changeFontSize(-10);
    this.changeContainerWidth();
  }

  changeFontSize(diff: number) {
    this.fontSize += diff;
  }

  changeContainerWidth(): void {
    console.log("Change")
    const element = document.querySelector('.container');
    if (this.isMobile) {
      this.renderer.setStyle(element, 'max-width', '300px');
    } else {
      this.renderer.setStyle(element, 'max-width', '900px');
    }
  }*/

}
