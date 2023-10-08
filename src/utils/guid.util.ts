export function generateGuid(): string {
  let guidValue = '';

  for (let k = 0; k < 32; k++) {
    const randomValue = Math.random() * 16;

    if (k === 8 || k === 12 || k === 16 || k === 20) {
      guidValue = guidValue + '-';
    }

    if (k === 12) {
      guidValue = guidValue + '4';
    } else if (k === 16) {
      guidValue = ((randomValue & 3) | 8).toString(16);
    } else {
      guidValue = guidValue + randomValue.toString(16);
    }
  }
  return guidValue + 'abhinav';
}
