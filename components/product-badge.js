export default function ProductBadge({ label, className = "" }) {
  if (!label) return null;

  return (
    <span
      className={[
        "tw-inline-flex tw-items-center tw-rounded-full tw-border tw-border-blue/15",
        "tw-bg-[linear-gradient(135deg,#fef3c7_0%,#fde68a_100%)] tw-px-[10px] tw-py-[5px]",
        "tw-text-[11px] tw-font-semibold tw-uppercase tw-tracking-[0.08em] tw-text-darkBlue",
        "tw-shadow-[0_12px_24px_-18px_rgba(15,23,42,0.5)]",
        className
      ].join(" ")}
    >
      {label}
    </span>
  );
}
