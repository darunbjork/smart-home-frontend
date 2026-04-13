import { DeviceStatus } from "../../types/device.types";
import { UserRole } from "../../types/auth.types";

type BadgeType = DeviceStatus | UserRole;

interface BadgeProps {
  value: BadgeType;
}

const badgeStyles: Record<BadgeType, { bg: string; text: string }> = {
  online:  { bg: "var(--status-online-bg)",  text: "var(--status-online-text)"  },
  offline: { bg: "var(--status-offline-bg)", text: "var(--status-offline-text)" },
  pending: { bg: "var(--status-pending-bg)", text: "var(--status-pending-text)" },
  unknown: { bg: "var(--status-unknown-bg)", text: "var(--status-unknown-text)" },
  owner:   { bg: "var(--role-owner-bg)",     text: "var(--role-owner-text)"     },
  member:  { bg: "var(--role-member-bg)",    text: "var(--role-member-text)"    },
};

export const Badge = ({ value }: BadgeProps) => {
  const style = badgeStyles[value];
  return (
    <span 
      className="px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--space-1)] text-[var(--text-sm)] font-[var(--weight-medium)]"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {value.toUpperCase()}
    </span>
  );
};