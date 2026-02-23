export function RegisterProgress({ step }: { step: number }) {
  return (
    <div className="w-full bg-gray-200 h-2 rounded">
      <div
        className="bg-black h-2 rounded transition-all"
        style={{ width: `${(step / 3) * 100}%` }}
      />
    </div>
  );
}
