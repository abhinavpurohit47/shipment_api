export function generateGuid(): string {
  const hexChars = '0123456789abcdef';
  let guidValue = '';

  for (let k = 0; k < 32; k++) {
    const randomIndex = Math.floor(Math.random() * 16);
    const randomChar = hexChars[randomIndex];

    if (k === 8 || k === 12 || k === 16 || k === 20) {
      guidValue = guidValue + '-';
    }

    if (k === 12) {
      guidValue = guidValue + '4';
    } else if (k === 16) {
      guidValue = guidValue + randomChar;
    } else {
      guidValue = guidValue + randomChar;
    }
  }
  return guidValue;
}
