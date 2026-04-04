import { GlassCard } from "@/components/caloriex";

interface Props {
  count: number;
}

export default function FoodsSkeletonCards({ count }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <GlassCard key={index} className="h-72 animate-pulse bg-white/40" />
      ))}
    </>
  );
}
