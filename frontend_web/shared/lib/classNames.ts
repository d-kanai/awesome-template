import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSSのクラス名を結合するユーティリティ関数
 * clsxとtailwind-mergeを組み合わせて、条件付きクラス名とクラス名の競合を解決
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
