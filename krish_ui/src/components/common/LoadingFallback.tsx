interface LoadingFallbackProps {
    label?: string;
    minHeightClassName?: string;
}

const LoadingFallback = ({
    label = 'Loading...',
    minHeightClassName = 'min-h-[55vh]',
}: LoadingFallbackProps) => (
    <div className={`${minHeightClassName} bg-[#FDFBF7] px-6 py-32 text-center text-sm font-semibold uppercase tracking-[0.3em] text-[#7a4b24]`}>
        {label}
    </div>
);

export default LoadingFallback;
