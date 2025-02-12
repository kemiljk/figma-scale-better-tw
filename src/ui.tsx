import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './ui.css';
import Checkbox from './components/Checkbox';
import Input from './components/Input';
import PercentIcon from './components/PercentIcon';
import HeightIcon from './components/HeightIcon';
import WidthIcon from './components/WidthIcon';
import Button from './components/Button';
import ScaleOriginGrid from './components/ScaleOriginGrid';

function App() {
  /* Constants */
  const [checkboxOn, setCheckboxOn] = React.useState(false);
  const [scaleAmount, setScaleAmount] = React.useState(100);
  const [scaleWidthAmount, setScaleWidthAmount] = React.useState(0);
  const [scaleHeightAmount, setScaleHeightAmount] = React.useState(0);
  const [roundingFactor, setRoundingFactor] = React.useState(1);
  const [scaleOrigin, setScaleOrigin] = React.useState({ x: 1, y: 1 }); // Center point by default

  /* Functions */

  const handleScaleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setScaleAmount(Number(event.target.value));
    }
  };

  const handleScaleWidthAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setScaleWidthAmount(Number(event.target.value));
    }
  };

  const handleScaleHeightAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setScaleHeightAmount(Number(event.target.value));
    }
  };

  onmessage = (event) => {
    if (event.data.pluginMessage.width) {
      setScaleWidthAmount(event.data.pluginMessage.width.toFixed(0));
    }
    if (event.data.pluginMessage.height) {
      setScaleHeightAmount(event.data.pluginMessage.height.toFixed(0));
    }
  };

  const handleScaleMaxWidthValueClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'scale-max-width-value',
          checkboxOn,
          roundingFactor,
          scaleOrigin,
        },
      },
      '*'
    );
  };

  const handleScaleMinWidthValueClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'scale-min-width-value',
          checkboxOn,
          roundingFactor,
          scaleOrigin,
        },
      },
      '*'
    );
  };

  const handleScaleMaxHeightValueClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'scale-max-height-value',
          checkboxOn,
          roundingFactor,
          scaleOrigin,
        },
      },
      '*'
    );
  };

  const handleScaleMinHeightValueClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'scale-min-height-value',
          checkboxOn,
          roundingFactor,
          scaleOrigin,
        },
      },
      '*'
    );
  };

  const handleScaleByPercentClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'scale-value',
          scaleAmount,
          checkboxOn,
          roundingFactor,
          scaleOrigin,
        },
      },
      '*'
    );
  };

  const handleScaleByWidthClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'scale-width-value',
          scaleWidthAmount,
          checkboxOn,
          roundingFactor,
          scaleOrigin,
        },
      },
      '*'
    );
  };

  const handleScaleByHeightClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'scale-height-value',
          scaleHeightAmount,
          checkboxOn,
          roundingFactor,
          scaleOrigin,
        },
      },
      '*'
    );
  };

  const handleScaleOriginSelect = (x: number, y: number) => {
    setScaleOrigin({ x, y });
    parent.postMessage(
      {
        pluginMessage: {
          type: 'update-scale-origin',
          scaleOrigin: { x, y },
        },
      },
      '*'
    );
  };

  return (
    <main className='w-full p-2 flex flex-col space-y-2'>
      <div className='flex w-full justify-between gap-2'>
        <div className='flex w-full flex-col items-center space-y-2'>
          <span className='text-figma-primary text-xs font-semibold w-full items-start'>
            Scale origin
          </span>
          <div className='w-full h-full p-2 flex justify-center items-center border border-figma-border rounded-lg'>
            <ScaleOriginGrid
              selectedPoint={scaleOrigin}
              onPointSelect={handleScaleOriginSelect}
            />
          </div>
        </div>
        <div className='flex w-full flex-col space-y-2'>
          <span className='text-figma-primary text-xs font-semibold'>Scale factor</span>
          <Input
            id='rounding-factor'
            type='number'
            value={roundingFactor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRoundingFactor(Number(e.target.value))
            }
            placeholder={'1'}
            disabled={false}
            onEnter={(value: string) => setRoundingFactor(Number(value))}
          />
        </div>
      </div>
      <span className='text-figma-primary text-xs pt-2 font-semibold'>Min/Max</span>
      <div className='flex space-x-2 items-center'>
        <Button
          size='default'
          variant='secondary'
          id='scale-max-width-value'
          onClick={handleScaleMaxWidthValueClick}
        >
          Scale to Max W
        </Button>
        <Button
          size='default'
          variant='secondary'
          id='scale-min-width-value'
          onClick={handleScaleMinWidthValueClick}
        >
          Scale to Min W
        </Button>
      </div>
      <div className='flex space-x-2 items-center'>
        <Button
          size='default'
          variant='secondary'
          id='scale-max-height-value'
          onClick={handleScaleMaxHeightValueClick}
        >
          Scale to Max H
        </Button>
        <Button
          size='default'
          variant='secondary'
          id='scale-min-height-value'
          onClick={handleScaleMinHeightValueClick}
        >
          Scale to Min H
        </Button>
      </div>
      <span className='text-figma-primary text-xs pt-2 font-semibold'>Specific amount</span>
      <div className='flex space-x-2 items-center'>
        <Input
          type='number'
          id='scaleAmount'
          value={scaleAmount === 0 ? '' : scaleAmount}
          placeholder='Scale (%)'
          disabled={false}
          onChange={handleScaleAmountChange}
          onEnter={handleScaleByPercentClick}
        />
        <Button
          variant='primary'
          size='sm'
          id='scaleByPercent'
          onClick={handleScaleByPercentClick}
        >
          <PercentIcon className='text-figma-onBrand' />
        </Button>
      </div>
      <div className='flex space-x-2 items-center'>
        <Input
          type='number'
          id='scaleWidth'
          value={scaleWidthAmount === 0 ? '' : scaleWidthAmount}
          placeholder='Width (px)'
          disabled={false}
          onChange={handleScaleWidthAmountChange}
          onEnter={handleScaleByWidthClick}
        />
        <Button
          variant='secondary'
          size='sm'
          id='scaleByWidth'
          onClick={handleScaleByWidthClick}
        >
          <WidthIcon className='text-figma-secondary' />
        </Button>
      </div>
      <div className='flex space-x-2 items-center'>
        <Input
          type='number'
          id='scaleHeight'
          value={scaleHeightAmount === 0 ? '' : scaleHeightAmount}
          placeholder='Height (px)'
          disabled={false}
          onChange={handleScaleHeightAmountChange}
          onEnter={handleScaleByHeightClick}
        />
        <Button
          variant='secondary'
          size='sm'
          id='scaleByHeight'
          onClick={handleScaleByHeightClick}
        >
          <HeightIcon className='text-figma-secondary' />
        </Button>
      </div>
      <div className='pt-2 pb-0 mb-0'>
        <Checkbox
          checkboxOn={checkboxOn}
          setCheckboxOn={setCheckboxOn}
        />
      </div>
    </main>
  );
}

const root = createRoot(document.getElementById('react-page')!);
root.render(<App />);
