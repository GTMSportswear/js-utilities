import { InputMask } from './input-mask';

let inputElement: HTMLInputElement;

QUnit.module('InputMask', {
  beforeEach: () => {
    inputElement = document.createElement('input');
  }
});

QUnit.test('Should mask empty telephone input on focus', assert => {
  InputMask.TelephoneInputMask(inputElement);
  inputElement.dispatchEvent(TestUtilities.FocusEvent);

  assert.equal(inputElement.value, '(   )    -    ');
});

QUnit.test('Should remove telephone mask with empty input on blur', assert => {
  InputMask.TelephoneInputMask(inputElement);
  inputElement.dispatchEvent(TestUtilities.FocusEvent);
  assert.equal(inputElement.value, '(   )    -    ');

  inputElement.dispatchEvent(TestUtilities.BlurEvent);
  assert.equal(inputElement.value, '');
});

QUnit.test('Should mask telephone input with entry for area code', assert => {
  InputMask.TelephoneInputMask(inputElement);
  inputElement.value = '12';
  inputElement.dispatchEvent(TestUtilities.KeyupEvent);

  assert.equal(inputElement.value, '(12 )    -    ');
});

QUnit.test('Should mask telephone input with entry for prefix', assert => {
  InputMask.TelephoneInputMask(inputElement);
  inputElement.value = '12345';
  inputElement.dispatchEvent(TestUtilities.KeyupEvent);

  assert.equal(inputElement.value, '(123) 45 -    ');
});

QUnit.test('Should mask telephone input with entry for line number', assert => {
  InputMask.TelephoneInputMask(inputElement);
  inputElement.value = '1234567';
  inputElement.dispatchEvent(TestUtilities.KeyupEvent);

  assert.equal(inputElement.value, '(123) 456-7   ');
});

QUnit.test('Should mask telephone input and strip letters from entry', assert => {
  InputMask.TelephoneInputMask(inputElement);
  inputElement.value = '1234s';
  inputElement.dispatchEvent(TestUtilities.KeyupEvent);

  assert.equal(inputElement.value, '(123) 4  -    ');
});

class TestUtilities {
  public static FocusEvent = new Event('focus', {
    bubbles: true,
    cancelable: true
  });

  public static BlurEvent = new Event('blur', {
    bubbles: true,
    cancelable: true
  });

  public static KeyupEvent = new Event('keyup', {
    bubbles: true,
    cancelable: true
  });
}

