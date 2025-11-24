import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArConfigService } from '../../services/ar-config.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
 selectedTarget: string = 'hiro-box';
  constructor(
    private router: Router,
    private arConfig: ArConfigService
  ) {}


  openAR() {
    if (this.selectedTarget) {
      this.arConfig.setCurrentTarget(this.selectedTarget);
      this.router.navigate(['/ar-viewer']);
    }
  }
}
