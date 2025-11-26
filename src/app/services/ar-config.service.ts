// -----------------------------
// FILE: src/app/services/ar-config.service.ts
// Reemplaza o añade este servicio (carga manifest y expone heroes).
// -----------------------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface HeroEntry {
  id: string;
  label: string;
  img: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArConfigService {
  private manifestPath = 'assets/ar/manifest.json';
  private heroes: HeroEntry[] = [];

  constructor(private http: HttpClient) {}

  // Carga el manifest y guarda heroes; devuelve la lista
  async loadManifest(): Promise<HeroEntry[]> {
    if (this.heroes.length) return this.heroes;
    try {
      const res: any = await this.http.get(this.manifestPath).toPromise();
      this.heroes = res?.heroes || [];
      return this.heroes;
    } catch (err) {
      console.error('Error loading AR manifest', err);
      this.heroes = [];
      return this.heroes;
    }
  }

  getHeroes(): HeroEntry[] {
    return this.heroes;
  }

  // Mantén tus métodos originales (compatibilidad)
  private currentTarget: string | null = null;
  setCurrentTarget(target: string) { this.currentTarget = target; }
  getCurrentTarget() { return this.currentTarget; }

  // Mapa simple existente (no lo toco)
  private experienceMap: Record<string, { marker: string }> = {
    'hiro-box':   { marker: 'marker-hiro' },
    'hiro-model': { marker: 'marker-hiro-model' },
    'hiro-square':{ marker: 'marker-hiro-square' },
    'pan-square':     { marker: 'marker-pan' },
    'kanji':      { marker: 'marker-kanji' }
  };

  getMarkerIdFor(target: string): string {
    return this.experienceMap[target]?.marker || 'marker-hiro';
  }
}
