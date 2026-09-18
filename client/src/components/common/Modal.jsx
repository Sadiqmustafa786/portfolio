export default function Modal({ children, open, onClose }) {
  if (!open) return null;
  return <div role="dialog">{children}</div>;
}
