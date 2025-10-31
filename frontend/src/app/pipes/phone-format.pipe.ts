import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true,
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    // remove all non-digits
    const digits = value.replace(/\D/g, '');

    // strip leading country code "1" if present
    const stripped = digits.startsWith('1') ? digits.slice(1) : digits;

    // ensure it's 10 digits
    if (stripped.length === 10) {
      return `${stripped.slice(0, 3)}-${stripped.slice(3, 6)}-${stripped.slice(6)}`;
    }

    // fallback if not
    return value;
  }
}
