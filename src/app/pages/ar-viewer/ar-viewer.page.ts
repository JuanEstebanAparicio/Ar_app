import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ArConfigService, ARTarget } from '../../services/ar-config.service';
import { CameraPreview, CameraPreviewOptions } from '@capacitor-community/camera-preview';

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
    private router: Router
  ) {}

  async ngOnInit() {
    this.target = this.arConfig.getCurrentTarget();
    
    if (!this.target) {
      console.error('No AR target selected');
      this.router.navigate(['/home']);
      return;
    }

    // Iniciar cámara directamente (Android pedirá permisos automáticamente)
    await this.startCamera();
  }

  async startCamera() {
  try {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'camera-preview',
      className: 'camera-preview',
      toBack: false,  // ✅ CAMBIAR A FALSE
      enableZoom: false,
      enableHighResolution: true,
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0
    };

    await CameraPreview.start(cameraPreviewOptions);
    this.cameraActive = true;
    
    console.log('✅ Camera started successfully');
    
    setTimeout(() => {
      this.initAR();
    }, 500);

  } catch (error: any) {
    console.error('❌ Error starting camera:', error);
    this.router.navigate(['/home']);
  }
}

  initAR() {
    if (!this.target) return;

    console.log('🎯 AR initialized with target:', this.target.preset);
    
    // Dibujar overlay AR en el canvas
    setTimeout(() => {
      this.drawAROverlay();
    }, 100);
  }

  drawAROverlay() {
  if (!this.canvasRef) return;

  const canvas = this.canvasRef.nativeElement;
  const ctx = canvas.getContext('2d', { alpha: true }); // ✅ Habilitar transparencia
  
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // ✅ NO limpiar con fondo negro, dejar transparente
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar marco de escaneo
  ctx.strokeStyle = '#00D9FF';
  ctx.lineWidth = 3;
  const boxSize = 250;
  const x = (canvas.width - boxSize) / 2;
  const y = (canvas.height - boxSize) / 2;
  ctx.strokeRect(x, y, boxSize, boxSize);

  // Dibujar esquinas
  const cornerLength = 30;
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 5;

  // Esquina superior izquierda
  ctx.beginPath();
  ctx.moveTo(x, y + cornerLength);
  ctx.lineTo(x, y);
  ctx.lineTo(x + cornerLength, y);
  ctx.stroke();

  // Esquina superior derecha
  ctx.beginPath();
  ctx.moveTo(x + boxSize - cornerLength, y);
  ctx.lineTo(x + boxSize, y);
  ctx.lineTo(x + boxSize, y + cornerLength);
  ctx.stroke();

  // Esquina inferior izquierda
  ctx.beginPath();
  ctx.moveTo(x, y + boxSize - cornerLength);
  ctx.lineTo(x, y + boxSize);
  ctx.lineTo(x + cornerLength, y + boxSize);
  ctx.stroke();

  // Esquina inferior derecha
  ctx.beginPath();
  ctx.moveTo(x + boxSize - cornerLength, y + boxSize);
  ctx.lineTo(x + boxSize, y + boxSize);
  ctx.lineTo(x + boxSize, y + boxSize - cornerLength);
  ctx.stroke();

  // Texto con fondo semi-transparente para mejor legibilidad
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, y - 60, canvas.width, 50);
  
  ctx.fillStyle = 'white';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Apunta al marcador ' + (this.target?.preset?.toUpperCase() || 'AR'), canvas.width / 2, y - 30);

  // Información del target con fondo
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
  
  ctx.fillStyle = 'white';
  ctx.font = '14px Arial';
  ctx.fillText('Marcador: ' + (this.target?.preset || 'custom'), canvas.width / 2, canvas.height - 25);
}

  async ngOnDestroy() {
    await this.stopCamera();
  }

  async ionViewWillLeave() {
    await this.stopCamera();
  }

  private async stopCamera() {
    if (this.cameraActive) {
      try {
        await CameraPreview.stop();
        this.cameraActive = false;
        console.log('✅ Camera stopped');
      } catch (error) {
        console.error('❌ Error stopping camera:', error);
      }
    }
  }
}