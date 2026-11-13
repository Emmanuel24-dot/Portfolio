import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, NAV_LINKS, PROFILE } from '../core/data/portfolio.data';
import { Icon } from '../shared/icon';
import { LocalTime } from '../shared/local-time';
import { MagneticDirective } from '../shared/magnetic.directive';

@Component({
  selector: 'app-footer',
  imports: [Icon, LocalTime, MagneticDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './footer.scss',
  template: `
    <footer class="foot">
      <div class="container">
        <div class="foot__grid">
          <div class="foot__col">
            <p class="foot__label">Navigation</p>
            <ul>
              @for (l of links; track l.id) {
                <li><a class="foot__link" [href]="'#' + l.id">{{ l.label }}</a></li>
              }
            </ul>
          </div>
          <div class="foot__col">
            <p class="foot__label">Contact</p>
            <ul>
              <li><a class="foot__link" [href]="'mailto:' + contact.email">{{ contact.email }}</a></li>
              @for (p of contact.phones; track p.e164) {
                <li><a class="foot__link" [href]="'tel:+' + p.e164">{{ p.display }}</a></li>
              }
              @for (s of socials; track s.label) {
                <li><a class="foot__link" [href]="s.url" target="_blank" rel="noopener noreferrer">{{ s.label }}</a></li>
              }
            </ul>
          </div>
          <div class="foot__col">
            <p class="foot__label">Heure locale - {{ profile.location }}</p>
            <p class="foot__time"><app-local-time [zone]="profile.timezone" /></p>
          </div>
          <div class="foot__col foot__col--end">
            <a class="foot__top" href="#top" appMagnetic aria-label="Revenir en haut de la page">
              <app-icon name="arrow-up" />
            </a>
          </div>
        </div>

        <p class="foot__word" aria-hidden="true">{{ profile.lastName }}<i class="caret"></i></p>

        <div class="foot__bar">
          <span>© {{ year }} {{ profile.firstName }} {{ profile.lastName.toUpperCase() }}</span>
          <span>Conçu & développé avec Angular</span>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly profile = PROFILE;
  protected readonly contact = CONTACT;
  protected readonly links = NAV_LINKS;
  protected readonly socials = CONTACT.socials.filter((s) => !!s.url);
  protected readonly year = new Date().getFullYear();
}
