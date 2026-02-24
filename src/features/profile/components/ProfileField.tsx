interface Props {
  label: string;
  value: string | number;
}

export default function ProfileField({ label, value }: Props) {
  return (
    <div className="flex justify-between items-center py-2 transition-colors hover:bg-slate-50/50 px-1 rounded-md">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
