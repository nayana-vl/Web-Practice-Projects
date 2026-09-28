import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'global-nav',
  standalone: true,
  imports: [NgClass],
  templateUrl: './global-nav.html',
  styleUrl: './global-nav.scss',
})
export class GlobalNav {
  @Input() activeToolbar: string = 'home';
  @Output() toggleToolbar = new EventEmitter<string>();

  tabs = [
    { id: 'home', label: 'Home' },
    { id: 'table', label: 'Table' },
    { id: 'charts', label: 'Charts' },
  ];

  selectTab(tabId: string): void {
    this.toggleToolbar.emit(tabId);
  }
}
