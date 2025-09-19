function pad(n: number | string, len = 2) {
  return String(n).padStart(len, "0");
}

const normalizeDate = (input: string): string | null => {
  if (!input || typeof input !== "string") return null;

  const hasOffsetMatch = input.match(/(Z|[+-]\d{2}:\d{2})$/);
  if (hasOffsetMatch) {
    const tail = hasOffsetMatch[0];
    const base = input.slice(0, -tail.length);
    const [datePart, timePart = ""] = base.split("T");
    if (!timePart) return null;
    let [timeNoMs, frac = ""] = timePart.split(".");
    frac = (frac + "000").slice(0, 3);
    return `${datePart}T${timeNoMs}.${frac}${tail}`;
  }

  const pat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/;
  if (!pat.test(input)) {
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
    return null;
  }

  let [datePart, timePart] = input.split("T");
  if (!timePart.includes(":")) return null;

  const timeSegments = timePart.split(":");
  let hh = timeSegments[0],
    mm = timeSegments[1],
    ss = "00",
    ms = "000";

  if (timeSegments.length >= 3) {
    const third = timeSegments[2];
    if (third.includes(".")) {
      const [sec, frac] = third.split(".");
      ss = pad(Number(sec));
      ms = (frac + "000").slice(0, 3);
    } else {
      ss = pad(Number(third));
    }
  }

  const d = new Date(
    Date.UTC(
      Number(datePart.slice(0, 4)),
      Number(datePart.slice(5, 7)) - 1,
      Number(datePart.slice(8, 10)),
      Number(hh),
      Number(mm),
      Number(ss),
      Number(ms)
    )
  );
  if (isNaN(d.getTime())) return null;

  const tzOffsetMin = d.getTimezoneOffset();
  const sign = tzOffsetMin <= 0 ? "+" : "-";
  const absMin = Math.abs(tzOffsetMin);
  const offH = pad(Math.floor(absMin / 60));
  const offM = pad(absMin % 60);

  return `${datePart}T${pad(hh)}:${pad(mm)}:${pad(
    ss
  )}.${ms}${sign}${offH}:${offM}`;
};

export default normalizeDate;
