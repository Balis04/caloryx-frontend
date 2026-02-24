interface Props {
  label: string;
  value: string | number;
}

export default function ProfileField({ label, value }: Props) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
