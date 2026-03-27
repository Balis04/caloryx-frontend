interface Props {
  label: string;
  value: string;
}

export default function RequestTextPanel({ label, value }: Props) {
  return (
    <div className="rounded-xl border bg-background p-4 text-sm">
      <p className="font-medium">{label}</p>
      <p className="mt-2 leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
