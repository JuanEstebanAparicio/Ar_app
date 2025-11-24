import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArConfigService, ARTarget } from '../../services/ar-config.service';
import { Camera } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

declare var AFRAME: any;

@Component({
  selector: 'app-ar-viewer',
  templateUrl: './ar-viewer.page.html',
  styleUrls: ['./ar-viewer.page.scss'],
  standalone: false
})
export class ArViewerPage implements OnInit, AfterViewInit {
  @ViewChild('arContainer', { static: false }) arContainer!: ElementRef;
  private scriptsLoaded = false;
  
  constructor(
    private arConfig: ArConfigService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      await this.showPermissionAlert();
      this.router.navigate(['/home']);
    }
  }

  ngAfterViewInit() {
    const target = this.arConfig.getCurrentTarget();
    
    if (!target) {
      console.error('No AR target selected');
      this.router.navigate(['/home']);
      return;
    }

    this.loadARScene(target);
  }

  async requestCameraPermission(): Promise<boolean> {
    try {
      const permission = await Camera.requestPermissions();
      console.log('Camera permission status:', permission);
      return permission.camera === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  async showPermissionAlert() {
    const alert = await this.alertController.create({
      header: 'Permiso de Cámara Requerido',
      message: 'Esta aplicación necesita acceso a la cámara para mostrar realidad aumentada. Por favor, habilita el permiso en la configuración de tu dispositivo.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ir a Configuración',
          handler: () => {
            // El usuario puede ir manualmente a configuración
          }
        }
      ]
    });
    await alert.present();
  }

  loadARScene(target: ARTarget) {
    if (this.scriptsLoaded) {
      this.createARScene(target);
      return;
    }

    // Cargar scripts de A-Frame y AR.js
    this.loadScript('https://aframe.io/releases/1.6.0/aframe.min.js')
      .then(() => {
        console.log('A-Frame loaded');
        return this.loadScript('https://raw.githack.com/AR-js-org/AR.js/3.4.7/aframe/build/aframe-ar.js');
      })
      .then(() => {
        console.log('AR.js loaded');
        this.scriptsLoaded = true;
        // Esperar un poco para que los scripts se inicialicen
        setTimeout(() => {
          this.createARScene(target);
        }, 500);
      })
      .catch((error) => {
        console.error('Error loading AR scripts:', error);
        this.showErrorAlert('Error al cargar librerías de AR');
      });
  }

  loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verificar si el script ya está cargado
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load: ${url}`));
      document.head.appendChild(script);
    });
  }

  createARScene(target: ARTarget) {
    const container = this.arContainer.nativeElement;
    container.innerHTML = ''; // Limpiar contenido previo

    // Crear loading overlay
    const loader = document.createElement('div');
    loader.className = 'ar-loader';
    loader.innerHTML = '<div>Iniciando cámara...</div>';
    container.appendChild(loader);

    try {
      // Crear escena A-Frame
      const scene = document.createElement('a-scene');
      scene.setAttribute('embedded', '');
      scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; videoTexture: true;');
      scene.setAttribute('vr-mode-ui', 'enabled: false');
      scene.setAttribute('renderer', 'logarithmicDepthBuffer: true; precision: medium;');

      // Crear marcador
      const marker = document.createElement('a-marker');
      if (target.preset) {
        marker.setAttribute('preset', target.preset);
      }

      // Crear contenido según tipo
      if (target.content.type === 'primitive') {
        const primitive = document.createElement(`a-${target.content.primitive}`);
        primitive.setAttribute('position', target.content.position || '0 0.5 0');
        primitive.setAttribute('color', target.content.color || '#4CC3D9');
        primitive.setAttribute('scale', target.content.scale || '1 1 1');
        primitive.setAttribute('rotation', target.content.rotation || '0 0 0');
        
        if (target.content.primitive === 'box') {
          primitive.setAttribute('animation', 'property: rotation; to: 0 405 0; loop: true; dur: 10000; easing: linear');
        }
        
        marker.appendChild(primitive);
      } else if (target.content.type === '3d-model') {
        const entity = document.createElement('a-entity');
        entity.setAttribute('gltf-model', target.content.src || '');
        entity.setAttribute('scale', target.content.scale || '1 1 1');
        entity.setAttribute('position', target.content.position || '0 0 0');
        marker.appendChild(entity);
      }

      // Crear cámara
      const camera = document.createElement('a-entity');
      camera.setAttribute('camera', '');

      // Agregar elementos a la escena
      scene.appendChild(marker);
      scene.appendChild(camera);
      container.appendChild(scene);

      // Ocultar loader después de 3 segundos
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.style.display = 'none';
        }
      }, 3000);

    } catch (error) {
      console.error('Error creating AR scene:', error);
      this.showErrorAlert('Error al crear escena AR');
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  ionViewWillLeave() {
    // Limpiar la escena al salir
    if (this.arContainer && this.arContainer.nativeElement) {
      const container = this.arContainer.nativeElement;
      container.innerHTML = '';
    }
  }
}