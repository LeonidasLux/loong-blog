/** 日期格式化工具 */

/** 归一化为 Date(兼容字符串/Date 输入) */
function toDate(input: string | Date): Date {
  return typeof input === 'string' ? new Date(input) : input;
}

/** ISO 数字日期:2026-08-21 */
export function formatDate(input: string | Date): string {
  const d = toDate(input);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** 中文日期:2026 年 8 月 21 日 */
export function formatDateCN(input: string | Date): string {
  const d = toDate(input);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

/** 归档年份:2026 */
export function yearOf(input: string | Date): string {
  return String(toDate(input).getFullYear());
}