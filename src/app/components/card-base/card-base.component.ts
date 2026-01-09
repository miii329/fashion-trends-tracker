import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-base',
  imports: [],
  templateUrl: './card-base.component.html',
  styleUrl: './card-base.component.css',
})
export class CardBaseComponent {
  @Input() title: string = '';
}
