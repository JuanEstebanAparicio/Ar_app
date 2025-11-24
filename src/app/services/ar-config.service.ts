import { Injectable } from '@angular/core';

export interface ARTarget {
  type: 'marker' | 'image' | 'location';
  preset?: string; // 'hiro', 'kanji', etc
  url?: string; // Para image tracking
  content: ARContent;
}

export interface ARContent {
  type: '3d-model' | 'primitive' | 'image' | 'video';
  src?: string;
  primitive?: 'box' | 'sphere' | 'cylinder';
  color?: string;
  scale?: string;
  position?: string;
  rotation?: string;
}

@Injectable({
  providedIn: 'root',
})

export class ArConfigService {
  private currentTarget: ARTarget | null = null;

  // Configuraciones predefinidas
  private targets: { [key: string]: ARTarget } = {
    'hiro-box': {
      type: 'marker',
      preset: 'hiro',
      content: {
        type: 'primitive',
        primitive: 'box',
        color: '#4CC3D9',
        scale: '1 1 1',
        position: '0 0.5 0',
        rotation: '0 45 0'
      }
    },
    'hiro-model': {
      type: 'marker',
      preset: 'hiro',
      content: {
        type: '3d-model',
        src: 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf',
        scale: '0.05 0.05 0.05',
        position: '0 0 0'
      }
    },
  };

  setCurrentTarget(targetKey: string) {
    this.currentTarget = this.targets[targetKey];
  }

  getCurrentTarget(): ARTarget | null {
    return this.currentTarget;
  }

  getAllTargets() {
    return Object.keys(this.targets);
  }

  getTargetInfo(key: string): ARTarget | undefined {
    return this.targets[key];
  }
}