export type DataPreset =
  | 'random'
  | 'sorted'
  | 'reverse'
  | 'nearly-sorted'
  | 'duplicates'
  | 'custom';

export function generateArrayByPreset(
  preset: DataPreset,
  size: number,
  customInput?: number[]
): number[] {
  if (preset === 'custom' && customInput && customInput.length > 0) {
    return [...customInput];
  }

  const min = 5;
  const max = 99;

  switch (preset) {
    case 'sorted': {
      const arr: number[] = [];
      const step = Math.max(1, Math.floor((max - min) / size));
      for (let i = 0; i < size; i++) {
        arr.push(Math.min(max, min + i * step));
      }
      return arr;
    }
    case 'reverse': {
      const arr = generateArrayByPreset('sorted', size);
      return arr.reverse();
    }
    case 'nearly-sorted': {
      const arr = generateArrayByPreset('sorted', size);
      // Swap 1 or 2 adjacent pairs
      const swaps = Math.max(1, Math.floor(size / 5));
      for (let s = 0; s < swaps; s++) {
        const idx = Math.floor(Math.random() * (size - 1));
        const temp = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = temp;
      }
      return arr;
    }
    case 'duplicates': {
      const uniquePool = [15, 30, 45, 60, 75, 90];
      const arr: number[] = [];
      for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * uniquePool.length);
        arr.push(uniquePool[randomIndex]);
      }
      return arr;
    }
    case 'random':
    default: {
      const arr: number[] = [];
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
      return arr;
    }
  }
}
