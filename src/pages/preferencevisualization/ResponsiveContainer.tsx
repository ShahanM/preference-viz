import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const HW_RATIO = 1.5;
interface ResponsiveContainerProps {
    children: (width: number, height: number) => React.ReactNode;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            if (entries.length > 0) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            {children(
                dimensions.width,
                dimensions.height <= HW_RATIO * dimensions.width ? dimensions.height : HW_RATIO * dimensions.width
            )}
        </div>
    );
};

export default ResponsiveContainer;
