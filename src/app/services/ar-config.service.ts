// src/app/services/ar-config.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArConfigService {

  /** 
   * Guarda la experiencia actual seleccionada (hiro-box, hiro-model, etc.)
   * Se mantiene EXACTAMENTE igual que tu código original.
   */
  private currentTarget: string | null = null;

  /**
   * NUEVO: Mapa centralizado de experiencias → marcadores reales en marker-scene.html
   * NO rompe tu código existente.
   */
  private experienceMap: Record<string, { marker: string }> = {
    'hiro-box':   { marker: 'marker-hiro' },
    'hiro-model': { marker: 'marker-hiro-model' },
    "hiro-square":    { marker: "marker-hiro-square" },
    'kanji':      { marker: 'marker-kanji' }
  };

  constructor() {}

  /**
   * Guarda qué experiencia escogió el usuario.
   * (Tu función ORIGINAL)
   */
  setCurrentTarget(target: string) {
    this.currentTarget = target;
  }

  /**
   * Retorna la experiencia actual.
   * (Tu función ORIGINAL)
   */
  getCurrentTarget() {
    return this.currentTarget;
  }

  /**
   * NUEVO: Devuelve el marker-id REAL que se debe activar en marker-scene.html
   * Ejemplo:
   *   "hiro-model" → "marker-hiro-model"
   *   "hiro-box"   → "marker-hiro"
   *   "kanji"      → "marker-kanji"
   */
  getMarkerIdFor(target: string): string {
    return this.experienceMap[target]?.marker || 'marker-hiro';
  }
}
