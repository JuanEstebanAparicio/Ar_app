import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-ar-viewer',
  templateUrl: './ar-viewer.page.html',
  styleUrls: ['./ar-viewer.page.scss'],
  standalone: false,
})
export class ArViewerPage {
  arSceneUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.arSceneUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ar/scene.html');
  }

}
