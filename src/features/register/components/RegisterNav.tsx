export function RegisterNav(props: {
  step: number;
  canGoNext: boolean;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const { step, canGoNext, loading, onBack, onNext, onFinish } = props;

  if (step === 1) {
    return (
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
      >
        Next
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button onClick={onBack} className="w-full border p-2 rounded">
        Back
      </button>

      {step < 3 ? (
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      ) : (
        <button
          onClick={onFinish}
          disabled={loading || !canGoNext}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Finish"}
        </button>
      )}
    </div>
  );
}
