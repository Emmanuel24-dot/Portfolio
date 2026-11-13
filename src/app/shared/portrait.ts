import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Portrait : affiche la photo si elle est fournie (PROFILE.photo),
 * sinon un emplacement graphique neutre - jamais un faux visage.
 */
@Component({
  selector: 'app-portrait',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'portrait', '[class.portrait--empty]': '!src()' },
  styleUrl: './portrait.scss',
  template: `
    @if (src()) {
      <img [src]="src()" [alt]="alt()" [attr.loading]="priority() ? 'eager' : 'lazy'"
        [attr.fetchpriority]="priority() ? 'high' : null" decoding="async" />
    } @else {
      <div class="portrait__ph" role="img" [attr.aria-label]="alt()">
        <svg class="portrait__lines" viewBox="0 0 200 250" preserveAspectRatio="none" aria-hidden="true">
          @for (i of rings; track i) {
            <ellipse cx="100" cy="112" [attr.rx]="20 + i * 16" [attr.ry]="26 + i * 20" />
          }
        </svg>
        <span class="portrait__mono">{{ initials() }}</span>
        @if (caption()) {
          <span class="portrait__cap">{{ caption() }}</span>
        }
      </div>
    }
  `,
})
export class Portrait {
  readonly src = input('');
  readonly alt = input('');
  readonly initials = input('ET');
  readonly caption = input('');
  /** true pour une image visible dès l'ouverture (hero). */
  readonly priority = input(false);
  protected readonly rings = [0, 1, 2, 3, 4, 5, 6];
}
