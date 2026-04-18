import LoadingSpinner from "@/components/LoadingSpinner";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
