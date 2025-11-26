import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArConfigService, HeroEntry } from '../../services/ar-config.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  selectedTarget: string = 'hiro-box';
  heroes: HeroEntry[] = [];
  selectedHeroId: string | null = null;
  loadingHeroes = true;

  constructor(
    private router: Router,
    private arConfig: ArConfigService
  ) {}

  async ngOnInit() {
    this.loadingHeroes = true;
    this.heroes = await this.arConfig.loadManifest();
    if (this.heroes.length) this.selectedHeroId = this.heroes[0].id;
    this.loadingHeroes = false;
  }

  openAR() {
    if (this.selectedTarget) {
      this.arConfig.setCurrentTarget(this.selectedTarget);
      this.router.navigate(['/ar-viewer']);
    }
  }

  getSelectedHeroImg(): string | null {
    const h = this.heroes.find(x => x.id === this.selectedHeroId);
    return h ? h.img : null;
  }
}
