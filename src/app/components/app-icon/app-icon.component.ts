import { Component, Input, OnChanges, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <div
      [class]="containerClass"
      [style.width]="size"
      [style.height]="size"
      [style.color]="color"
      [innerHTML]="svgContent"
    ></div>
  `,
})
export class UserIconComponent implements OnChanges {
  @Input() name: string = '';
  @Input() size: string = '2rem';
  @Input() color: string = '#BEB9B4';
  @Input() containerClass: string = '';

  svgContent?: SafeHtml;

  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  ngOnChanges() {
    if (this.name) {
      const path = `assets/${this.name}.svg`;

      this.http.get(path, { responseType: 'text' }).subscribe({
        next: (svgText) => {
          // SVGのwidth/heightを削除して、viewBoxだけ残す
          const cleaned = svgText
            .replace(/width="[^"]*"/g, '')
            .replace(/height="[^"]*"/g, '');

          this.svgContent = this.sanitizer.bypassSecurityTrustHtml(cleaned);
        },
        error: (err) => {
          console.error('Failed to load SVG:', err);
        },
      });
    }
  }
}
