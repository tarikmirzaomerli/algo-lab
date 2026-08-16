import { describe, it, expect } from 'vitest';
import { interpolationSearch } from '../../core/algorithms/searching/interpolationSearch';

describe('Interpolation Search Unit Tests', () => {
  const sortedArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  it('1. Hedef eleman ortalarda olduğunda (target = 70) doğru indeksi dönmeli', () => {
    const steps = interpolationSearch.generateSteps(sortedArray, 70);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices).toEqual([6]);
    expect(lastStep.indices).toEqual([6]);
  });

  it('2. Hedef ilk eleman olduğunda (target = 10) doğru indeksi dönmeli', () => {
    const steps = interpolationSearch.generateSteps(sortedArray, 10);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices).toEqual([0]);
  });

  it('3. Hedef son eleman olduğunda (target = 100) doğru indeksi dönmeli', () => {
    const steps = interpolationSearch.generateSteps(sortedArray, 100);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices).toEqual([9]);
  });

  it('4. Hedef dizide bulunmadığında (target = 45) boş sortedIndices ile sonlanmalı', () => {
    const steps = interpolationSearch.generateSteps(sortedArray, 45);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices).toEqual([]);
  });

  it('5. Hedef dizi sınırlarının altında olduğunda (target = 5) güvenli şekilde bulunamadı dönmeli', () => {
    const steps = interpolationSearch.generateSteps(sortedArray, 5);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices).toEqual([]);
  });

  it('6. Hedef dizi sınırlarının üstünde olduğunda (target = 150) güvenli şekilde bulunamadı dönmeli', () => {
    const steps = interpolationSearch.generateSteps(sortedArray, 150);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices).toEqual([]);
  });

  it('7. Tek elemanlı dizide eşleşen hedef (target = 42) doğru bulunmalı', () => {
    const singleArr = [42];
    const steps = interpolationSearch.generateSteps(singleArr, 42);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices).toEqual([0]);
  });

  it('8. Tek elemanlı dizide eşleşmeyen hedef (target = 99) bulunamadı dönmeli', () => {
    const singleArr = [42];
    const steps = interpolationSearch.generateSteps(singleArr, 99);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices).toEqual([]);
  });

  it('9. Tüm elemanları aynı olan dizide ([5, 5, 5, 5]) hedef (target = 5) sonsuz döngüye girmeden bulunmalı', () => {
    const dupArr = [5, 5, 5, 5];
    const steps = interpolationSearch.generateSteps(dupArr, 5);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices.length).toBeGreaterThan(0);
  });

  it('10. Negatif sayılar içeren dizide ([-50, -20, -5, 0, 10, 30]) hedef (target = -20) doğru bulunmalı', () => {
    const negArr = [-50, -20, -5, 0, 10, 30];
    const steps = interpolationSearch.generateSteps(negArr, -20);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices).toEqual([1]);
  });

  it('11. Düzensiz aralıklı dizide ([2, 5, 100, 1000, 5000]) hedef (target = 100) doğru bulunmalı', () => {
    const nonUniform = [2, 5, 100, 1000, 5000];
    const steps = interpolationSearch.generateSteps(nonUniform, 100);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.sortedIndices).toEqual([2]);
  });

  it('12. Boş dizi verildiğinde güvenli şekilde boş adım dizisi dönmeli', () => {
    const steps = interpolationSearch.generateSteps([], 10);
    expect(steps).toHaveLength(0);
  });
});
