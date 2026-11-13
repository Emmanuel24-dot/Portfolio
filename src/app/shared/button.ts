import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from './icon';

/**
 * Bouton / lien à double étiquette (roulement au survol) + pastille d'icône.
 * Usage : <a appBtn href="#contact" label="Me contacter" variant="primary"></a>
 */
@Component({
  selector: 'a[appBtn], button[appBtn]',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'btn',
    '[class.btn--primary]': "variant() === 'primary'",
    '[class.btn--sm]': "size() === 'sm'",
  },
  template: `
    <span class="btn__label" [attr.data-text]="label()"><span>{{ label() }}</span></span>
    <span class="btn__icon"><app-icon [name]="icon()" /></span>
  `,
})
export class Button {
  readonly label = input.required<string>();
  readonly icon = input('arrow-up-right');
  readonly variant = input<'primary' | 'ghost'>('ghost');
  readonly size = input<'md' | 'sm'>('md');
}
