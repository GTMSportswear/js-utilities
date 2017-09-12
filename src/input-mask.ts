export class InputMask {
  public static TelephoneInputMask(inputElement: HTMLInputElement): void {
    if (inputElement.tagName !== 'INPUT') return;

    const digitRegex = /\d+/g;
    const backspaceKeyCode = 8;
    const deleteKeyCode = 46;
    const leftArrowKeyCode = 37;
    const rightArrowKeyCode = 39;

    inputElement.addEventListener('keyup', (e: KeyboardEvent) => {
      const input = <HTMLInputElement>e.target;
      const inputValue = input.value;
      const digits = inputValue.match(digitRegex);
      let cursorStart = input.selectionStart;
      let cursorEnd = input.selectionEnd;

      if (digits === null) {
        input.value = '';
        input.value = this.TelephoneInputMaskFormat(input.value);
        requestAnimationFrame(() => {
          input.setSelectionRange(1, 1);
        });
        return;
      }

      if (e.keyCode === leftArrowKeyCode || e.keyCode === rightArrowKeyCode) return;

      const digitsArray = digits.join('');

      if (e.keyCode === backspaceKeyCode)
        return requestAnimationFrame(() => {
          input.setSelectionRange(input.selectionStart, input.selectionEnd);
        });

      if (this.NumberIsTooLong(digitsArray, inputValue))
        return this.ApplyTelephoneMask(digitsArray, input);

      if ((cursorStart === 5 || cursorStart === 8) && digitsArray.length > 10 && inputValue.length >= 14) {
        cursorStart++;
        cursorEnd++;
      }

      input.value = this.TelephoneInputMaskFormat(digitsArray);

      if (digitsArray.length > 10)
        return requestAnimationFrame(() => {
          input.setSelectionRange(cursorStart, cursorEnd);
        });

      const cursorPositionIndex = this.GetRegexLastIndex(digitRegex, input.value, 1);

      requestAnimationFrame(() => {
        input.setSelectionRange(cursorPositionIndex, cursorPositionIndex);
      });
    });

    inputElement.addEventListener('keydown', (e: KeyboardEvent) => {
      const input = <HTMLInputElement>e.target;
      const inputValue = input.value;
      const digits = inputValue.match(digitRegex);

      if (digits === null || e.keyCode === backspaceKeyCode || e.keyCode === deleteKeyCode) return;

      const digitsArray = digits.join('');

      if (digitsArray.length >= 10 && input.selectionStart > 12) {
        e.preventDefault();
        return false;
      }
    });

    inputElement.addEventListener('focus', (e: Event) => {
      const input = <HTMLInputElement>e.target;
      const inputValue = input.value;
      const digits = inputValue.match(digitRegex);

      if (digits !== null) return;

      input.value = this.TelephoneInputMaskFormat(inputValue);
      requestAnimationFrame(() => {
        input.setSelectionRange(1, 1);
      });
    });

    inputElement.addEventListener('blur', (e: Event) => {
      const input = <HTMLInputElement>e.target;
      const inputValue = input.value;
      const digits = inputValue.match(digitRegex);

      if (digits === null) {
        input.value = '';
        return;
      }
      
      const digitsArray = digits.join('');
      
      if (this.NumberIsTooLong(digitsArray, inputValue))
        return this.ApplyTelephoneMask(digitsArray, input);
    });
  }

  private static TelephoneInputMaskFormat(value: string): string {
    const values = value.split('');
    const emptyValues = Array(11).join(' ').split('');
    const formattedValue = emptyValues.map((val: string, i) => {
      if (values[i] !== undefined)
        val = values[i];
      if (i === 0)
        val = '(' + val;
      if (i === 3)
        val = ') ' + val;
      if (i === 6)
        val = '-' + val;

      return val;
    }).join('');

    return formattedValue;
  }

  private static GetRegexLastIndex(regex, value, returnValue): number {
    if (regex.exec(value) !== null) {
      returnValue = regex.lastIndex;
      return this.GetRegexLastIndex(regex, value, returnValue);
    }
    else
      return returnValue;
  }
  
    private static NumberIsTooLong(digitsArray, inputValue): boolean {
    if (digitsArray.length >= 10 && inputValue.length > 14)
      return true;
    else
      return false;
  }

  private static ApplyTelephoneMask(digitsArray, input) {
    return requestAnimationFrame(() => {
      input.value = this.TelephoneInputMaskFormat(digitsArray);
      input.setSelectionRange(input.selectionStart, input.selectionEnd);
    });
  }
}
