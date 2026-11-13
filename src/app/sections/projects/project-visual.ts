import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { Project } from '../../core/models/portfolio.models';
import { MotionService } from '../../core/services/motion.service';

/**
 * Visuel de projet.
 * - Si `project.image` est renseigné : la vraie capture s'affiche dans le cadre.
 * - Sinon : une illustration abstraite et thématique (jamais une fausse capture d'écran).
 */
@Component({
  selector: 'app-project-visual',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-visual.html',
  styleUrl: './project-visual.scss',
  host: {
    '[style.--tint]': 'project().tint',
    '[class.is-mobile]': "project().kind === 'mobile'",
    '[class.has-img]': '!!project().image',
    '(pointermove)': 'tilt($event)',
    '(pointerleave)': 'reset()',
  },
})
export class ProjectVisual {
  readonly project = input.required<Project>();

  private readonly motion = inject(MotionService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  // Données de dessin (purement décoratives)
  protected readonly bars = [96, 150, 120, 188, 160, 226, 196, 252, 214, 276];
  protected readonly gridY = [80, 130, 180, 230, 280, 330];
  protected readonly modules = [0.82, 0.46, 1, 0.64, 0.3, 0.9].map((pct, i) => ({
    x: 36 + (i % 3) * 194,
    y: 34 + Math.floor(i / 3) * 172,
    pct,
  }));
  protected readonly tiles = Array.from({ length: 8 }, (_, i) => ({
    x: 30 + (i % 4) * 148,
    y: 34 + Math.floor(i / 4) * 172,
    shape: i % 3,
  }));
  protected readonly ecg =
    'M0 210 H118 L132 210 L146 176 L160 244 L176 92 L194 322 L210 210 H330 L344 186 L358 236 L374 118 L390 300 L406 210 H640';
  protected readonly boxes = [
    { x: 80, y: 130, w: 90, h: 60 }, { x: 180, y: 130, w: 70, h: 84 }, { x: 260, y: 130, w: 110, h: 50, hi: true },
    { x: 380, y: 130, w: 80, h: 70 }, { x: 90, y: 230, w: 120, h: 76 }, { x: 222, y: 230, w: 80, h: 56 },
    { x: 314, y: 230, w: 96, h: 88 }, { x: 422, y: 230, w: 130, h: 64 }, { x: 80, y: 330, w: 100, h: 70 },
    { x: 192, y: 330, w: 140, h: 86, hi: true }, { x: 344, y: 330, w: 80, h: 60 }, { x: 436, y: 330, w: 110, h: 78 },
  ];
  protected readonly looks = [
    { x: 90, o: 0.55 },
    { x: 250, o: 1 },
    { x: 410, o: 0.75 },
  ];
  protected readonly miniBars = [40, 64, 52, 88, 70, 104];

  /** Le cadre adopte le format réel de la capture (aucun rognage). */
  protected fitRatio(e: Event): void {
    const img = e.target as HTMLImageElement;
    if (img.naturalWidth && img.naturalHeight) {
      this.host.nativeElement.style.setProperty('--img-ratio', `${img.naturalWidth} / ${img.naturalHeight}`);
    }
  }

  protected tilt(e: PointerEvent): void {
    if (this.motion.reduced || e.pointerType !== 'mouse') return;
    const el = this.host.nativeElement;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  }

  protected reset(): void {
    const el = this.host.nativeElement;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }
}
