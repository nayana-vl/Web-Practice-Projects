import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { cloneDeep } from 'lodash';
import { FngCheckboxComponent } from '@festo-ui/angular';

const MAX_SUGGESTIONS_LENGTH = 8;

interface TagSuggestion {
  value: string;
  template: string;
}

@Component({
  selector: 'fv-tracker-search',
  standalone: true,
  imports: [FormsModule, CommonModule, FngCheckboxComponent],
  templateUrl: './tracker-search.component.html',
  styleUrl: './tracker-search.component.scss'
})
export class TrackerSearchComponent implements OnInit {
  @Input() value = '';
  @Output() selectedValue = new EventEmitter<string>();
  @Input() allTags: string[] = [];
  @Output() allTagsChange = new EventEmitter<string[]>();
  @Input() disabled = false;
  @Input() newTagToBeAdded = true;
  @Input() multiple = false;
  @Input() selectedTags: string[] = [];
  @Output() selectedTagsChange = new EventEmitter<string[]>();
  @Input() clearOnceAdded = false;
  @ViewChild('searchSuggetionInput') autoFocus!: ElementRef<HTMLInputElement>;

  filteredTags: TagSuggestion[] = [];
  showSuggestions = false;
  activeIndex = -1;
  previousValue = '';
  @Input() showAllSuggestions = false;

  private elementRef = inject(ElementRef);

  ngOnInit() {
    this.getAllFilteredTags();
    this.previousValue = cloneDeep(this.value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.onClickOutside();
    }
  }

  clearInput(): void {
    this.value = '';
    this.selectedValue.emit(this.value);
    this.getAllFilteredTags();
    this.showSuggestions = true;
    this.previousValue = '';
  }

  filterSuggetions(event: Event): void {
    this.showSuggestions = true;
    const inputValue = (event.target as HTMLInputElement).value;
    this.value = inputValue;

    if (this.value && this.value.length > 0) {
      const suggestionStrings = this.allTags.filter(
        s => s.toLowerCase().indexOf(this.value.toLowerCase()) !== -1
      );

      this.filteredTags = suggestionStrings.map(s => ({
        value: s,
        template: s
      }));

      const filterIndex = this.filteredTags.findIndex(
        s => s.value.toLowerCase() === this.value.toLowerCase()
      );

      if (this.newTagToBeAdded) {
        if (filterIndex !== -1) {
          this.activeIndex = filterIndex;
        } else {
          this.filteredTags.unshift({
            value: this.value,
            template: `<strong>${this.value}</strong>`
          });
          this.activeIndex = 0;
        }
      }
    } else {
      this.getAllFilteredTags();
    }
  }

  getAllFilteredTags(): void {
    this.filteredTags = [];
    for (const tag of this.allTags) {
      this.filteredTags.push({
        value: tag,
        template: tag
      });
    }
    this.activeIndex = -1;
  }

  selectSuggestion(value: string): void {
    if (this.multiple) {
      this.selectMutipleTags(value);
      return;
    }
    this.showSuggestions = false;
    this.value = value.trim();
    if (this.value === '') {
      return;
    }
    this.selectedValue.emit(this.value);
    if (!this.allTags.includes(value.trim())) {
      this.allTagsChange.emit(this.allTags);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex = (this.activeIndex + 1) % this.filteredTags.length;
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex = (this.activeIndex - 1 + this.filteredTags.length) % this.filteredTags.length;
        break;

      case 'Enter':
        event.preventDefault();
        if (this.filteredTags[this.activeIndex]) {
          this.selectSuggestion(this.filteredTags[this.activeIndex].value);
        }
        break;

      case 'Escape':
        this.showSuggestions = false;
        this.activeIndex = -1;
        break;
    }
  }

  get cappedSuggestions(): TagSuggestion[] {
    if (this.showAllSuggestions) {
      return this.filteredTags;
    }
    return this.filteredTags.slice(0, MAX_SUGGESTIONS_LENGTH);
  }

  removeTag(index: number): void {
    this.selectedTags.splice(index, 1);
    this.selectedTagsChange.emit(this.selectedTags);
  }

  onClickOutside(): void {
    this.showSuggestions = false;
  }

  selectMutipleTags(value: string): void {
    const tagIndex = this.selectedTags.findIndex(tag => tag === value);
    if (tagIndex === -1) {
      this.selectedTags.push(value);
    } else {
      this.selectedTags.splice(tagIndex, 1);
    }
    this.selectedTagsChange.emit(this.selectedTags);
  }

  onCheckboxChange(value: string): void {
    this.selectMutipleTags(value);
  }

  focusSearchInputInSuggestions(): void {
    setTimeout(() => {
      this.autoFocus?.nativeElement?.focus();
    });
  }
}