import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-base',
  imports: [CommonModule],
  templateUrl: './card-base.component.html',
  styleUrl: './card-base.component.css',
})
export class CardBaseComponent {
  @Input() title: string = '';
  @Input() category: string = '';
  @Input() description: string = '';
  @Input() url: string = '';
}
