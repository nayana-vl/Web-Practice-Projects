import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tracker-toolbar',
  imports: [],
  templateUrl: './tracker-toolbar.html',
  styleUrl: './tracker-toolbar.scss',
})
export class TrackerToolbar {
  @Input() activeToolbar: string = 'home';
  @Output() toggleToolbar = new EventEmitter<string>();
}
