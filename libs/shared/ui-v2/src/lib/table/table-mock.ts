export interface TestData {
  index: number;
}

export function getTestData(n = 10): TestData[] {
  return Array.from({ length: n }).map((e, i) => ({ index: i }));
}
