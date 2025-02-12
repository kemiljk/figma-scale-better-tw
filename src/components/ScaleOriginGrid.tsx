import * as React from 'react';

interface ScaleOriginGridProps {
  selectedPoint: { x: number; y: number };
  onPointSelect: (x: number, y: number) => void;
}

const ScaleOriginGrid: React.FC<ScaleOriginGridProps> = ({ selectedPoint, onPointSelect }) => {
  return (
    <div className='grid grid-cols-3 gap-1 place-content-center size-16'>
      {[0, 1, 2].map((y) =>
        [0, 1, 2].map((x) => (
          <button
            key={`${x}-${y}`}
            className={`w-full h-5 rounded transition-colors
              ${
                selectedPoint.x === x && selectedPoint.y === y
                  ? 'bg-figma-blue'
                  : 'bg-figma-tertiaryBg hover:bg-figma-tertiaryBg-hover'
              }`}
            onClick={() => onPointSelect(x, y)}
            aria-label={`Scale origin point ${x},${y}`}
          />
        ))
      )}
    </div>
  );
};

export default ScaleOriginGrid;
