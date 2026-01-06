import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[mask]',
  standalone: true
})
export class MaskDirective {
  @Input('mask') maskPattern = '';
  private isUpdating = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  onInput(): void {
    if (this.isUpdating) return;
    const input = this.el.nativeElement;
    const raw = input.value || '';
    const digits = raw.replace(/\D/g, '');
    if (!this.maskPattern) {
      return;
    }

    let result = '';
    let digitIndex = 0;

    for (let i = 0; i < (this.maskPattern || '').length; i++) {
      const m = this.maskPattern[i];
      if (m === '0') {
        if (digitIndex < digits.length) {
          result += digits[digitIndex];
          digitIndex++;
        } else {
          break;
        }
      } else {
        result += m;
      }
    }

    if (input.value === result) return;

    // prevent recursive input events
    this.isUpdating = true;
    input.value = result;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    this.isUpdating = false;
  }
}
