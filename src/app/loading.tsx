import { ShuffleLoader } from '@/components/shuffle-loader';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <ShuffleLoader />
    </div>
  );
}
