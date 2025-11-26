import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ArConfigService } from '../../services/ar-config.service';

@Component({
  selector: 'app-ar-viewer',
  templateUrl: './ar-viewer.page.html',
  styleUrls: ['./ar-viewer.page.scss'],
  standalone: false
})
export class ArViewerPage implements OnInit {
  arSceneUrl: SafeResourceUrl | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private arConfig: ArConfigService,
    private router: Router
  ) {}

ngOnInit() {
  const target = this.arConfig.getCurrentTarget();

  if (!target) {
    this.router.navigate(['/home']);
    return;
  }

  const markerId = this.arConfig.getMarkerIdFor(target);

  const url = `assets/ar/marker-scene.html?marker=${markerId}`;

  this.arSceneUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

  console.log("Loading AR with marker:", markerId);
}

}