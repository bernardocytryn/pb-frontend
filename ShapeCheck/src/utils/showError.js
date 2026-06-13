export default function showError(message) {
  try {
    const ev = new CustomEvent("app:error", { detail: String(message) });
    window.dispatchEvent(ev);
  } catch (e) {
    console.error(message);
  }
  console.error(message);
}
