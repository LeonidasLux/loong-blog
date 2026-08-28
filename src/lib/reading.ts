/** 阅读时长估算(纯逻辑) */
/** 中文按约 350 字/分钟、英文按约 200 词/分钟的粗略估算 */

export function estimateReadTime(
  source: string | undefined,
  fallbackMinutes = 1,
): number {
  if (!source) return fallbackMinutes;
  const cnChars = (source.match(/[一-龥]/g) ?? []).length;
  const latinWords = (
    source.replace(/[一-龥]/g, '').match(/[A-Za-z0-9]+/g) ?? []
  ).length;
  const minutes = Math.ceil(cnChars / 350 + latinWords / 200);
  return Math.max(fallbackMinutes, minutes);
}