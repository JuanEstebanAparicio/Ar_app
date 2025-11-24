import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ArConfigService, ARTarget } from '../../services/ar-config.service';
import { Camera } from '@capacitor/camera';

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

  async ngOnInit() {
    // ✅ Solicitar permiso de cámara ANTES de cargar AR
    await this.requestCameraPermission();
    
    const target = this.arConfig.getCurrentTarget();
    
    if (!target) {
      console.error('No AR target selected');
      this.router.navigate(['/home']);
      return;
    }

    const htmlContent = this.generateARScene(target);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this.arSceneUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // ✅ NUEVO: Solicitar permiso de cámara
  async requestCameraPermission() {
    try {
      const permission = await Camera.requestPermissions();
      console.log('Camera permission:', permission);
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  }

  private generateARScene(target: ARTarget): string {
    let markerContent = '';

    if (target.content.type === 'primitive') {
      const animations = target.content.primitive === 'box' 
        ? 'animation="property: rotation; to: 0 405 0; loop: true; dur: 10000; easing: linear"'
        : '';
      
      markerContent = `
        <a-${target.content.primitive}
          position="${target.content.position}"
          color="${target.content.color}"
          scale="${target.content.scale}"
          rotation="${target.content.rotation}"
          ${animations}>
        </a-${target.content.primitive}>
      `;
    } else if (target.content.type === '3d-model') {
      markerContent = `
        <a-entity
          gltf-model="${target.content.src}"
          scale="${target.content.scale}"
          position="${target.content.position}">
        </a-entity>
      `;
    }

    const markerElement = target.preset 
      ? `<a-marker preset="${target.preset}">`
      : `<a-marker type="pattern" url="${target.url}">`;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>AR Scene</title>
  <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
  <script src="https://raw.githack.com/AR-js-org/AR.js/3.4.7/aframe/build/aframe-ar.js"></script>
  <style>
    body { margin: 0; overflow: hidden; }
    .arjs-loader {
      height: 100%; width: 100%; position: absolute;
      top: 0; left: 0; background-color: rgba(0, 0, 0, 0.8);
      z-index: 9999; display: flex;
      justify-content: center; align-items: center;
    }
    .arjs-loader div {
      text-align: center; font-size: 1.25em; color: white;
    }
  </style>
</head>
<body>
  <div class="arjs-loader">
    <div>Cargando AR, espere...</div>
  </div>
  
  <a-scene
    embedded
    arjs="sourceType: webcam; debugUIEnabled: false; videoTexture: true;"
    vr-mode-ui="enabled: false"
    renderer="logarithmicDepthBuffer: true; precision: medium;">
    
    ${markerElement}
      ${markerContent}
    </a-marker>
    
    <a-entity camera></a-entity>
  </a-scene>

  <script>
    // Esperar a que todo cargue
    window.addEventListener('load', function() {
      setTimeout(() => {
        const loader = document.querySelector('.arjs-loader');
        if (loader) loader.style.display = 'none';
      }, 3000);
    });

    // Manejar errores de cámara
    window.addEventListener('error', function(e) {
      console.error('AR Scene Error:', e);
    });
  </script>
</body>
</html>
    `;
  }
}