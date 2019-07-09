export default function eq([a, b, value = true, notValue = false]: any[]) {
  return a === b ? value : notValue;
}
