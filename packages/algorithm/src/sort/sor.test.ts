import { describe, expect, it } from "vitest";
import { bubble } from "./bubble";
import { selectSort } from "./selectSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quick";
import { insertSort } from "./insertSort";
import { countSort } from "./count";
import { shellSort } from "./shellSort";
import { bucketSort } from "./bucketSort";
import { radixSort } from "./radixSort";

const input = [18, 21, 3, 5, 4, 7, 9, 12, 6];

const output = [...input].sort((a, b) => a - b);

describe("sort", () => {
  it("bubble", () => {
    expect(bubble(input)).toEqual(output);
  });
  it("selectSort", () => {
    expect(selectSort(input)).toEqual(output);
  });
  it("mergeSort", () => {
    expect(mergeSort(input)).toEqual(output);
  });
  it("quickSort", () => {
    expect(quickSort(input)).toEqual(output);
  });
  it("insertSort", () => {
    expect(insertSort(input)).toEqual(output);
  });
  it("countSort", () => {
    expect(countSort(input,15)).toEqual(output);
  });
  it("shellSort", () => {
    expect(shellSort(input)).toEqual(output);
  });
  it("bucketSort", () => {
    expect(bucketSort(input)).toEqual(output);
  });
  it("radixSort", () => {
    expect(radixSort(input)).toEqual(output);
  });
});
