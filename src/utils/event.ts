export function stopEvent(e: Event | React.UIEvent): void {
  e.preventDefault();
  e.stopPropagation();
}
