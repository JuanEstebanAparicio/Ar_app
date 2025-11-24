import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ArConfigService, ARTarget } from '../../services/ar-config.service';
import { CameraPreview, CameraPreviewOptions } from '@capacitor-community/camera-preview';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ar-viewer',
  templateUrl: './ar-viewer.page.html',
  styleUrls: ['./ar-viewer.page.scss'],
  standalone: false
})
export class ArViewerPage implements OnInit, OnDestroy {
  @ViewChild('arCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private cameraActive = false;
  private target: ARTarget | null = null;

  constructor(
    private arConfig: ArConfigService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.target = this.arConfig.getCurrentTarget();
    
    if (!this.target) {
      console.error('No AR target selected');
      this.router.navigate(['/home']);
      return;
    }

    await this.startCamera();
  }

  async startCamera() {
    try {
      const cameraPreviewOptions: CameraPreviewOptions = {
        position: 'rear',
        parent: 'camera-preview',
        className: 'camera-preview',
        toBack: true,
        enableZoom: false,
        enableHighResolution: true,
        width: window.innerWidth,
        height: window.innerHeight
      };

      await CameraPreview.start(cameraPreviewOptions);
      this.cameraActive = true;
      
      console.log('Camera started successfully');
      
      // Inicializar AR después de que la cámara esté activa
      setTimeout(() => {
        this.initAR();
      }, 1000);

    } catch (error) {
      console.error('Error starting camera:', error);
      await this.showErrorAlert('No se pudo iniciar la cámara. Verifica los permisos.');
      this.router.navigate(['/home']);
    }
  }

  initAR() {
    if (!this.target) return;

    // Aquí puedes agregar la lógica de AR
    // Por ahora, solo mostraremos un mensaje de que funciona
    console.log('AR initialized with target:', this.target);
    
    // Dibujar algo simple en el canvas para probar
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Dibujar un cuadrado de prueba
        ctx.fillStyle = 'rgba(76, 195, 217, 0.5)';
        ctx.fillRect(
          window.innerWidth / 2 - 50,
          window.innerHeight / 2 - 50,
          100,
          100
        );
        
        // Texto de prueba
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('AR Activo - Apunta al marcador', 50, 50);
      }
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

  async ngOnDestroy() {
    if (this.cameraActive) {
      try {
        await CameraPreview.stop();
        this.cameraActive = false;
      } catch (error) {
        console.error('Error stopping camera:', error);
      }
    }
  }

  async ionViewWillLeave() {
    if (this.cameraActive) {
      try {
        await CameraPreview.stop();
        this.cameraActive = false;
      } catch (error) {
        console.error('Error stopping camera:', error);
      }
    }
  }
}