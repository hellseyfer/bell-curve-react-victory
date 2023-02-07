import { useEffect, useState } from 'react';
import React = require('react');
// @ts-ignore
import { VictoryChart } from 'victory-chart';
// @ts-ignore
import { VictoryLine } from 'victory-line';
// @ts-ignore
import { VictoryScatter } from 'victory-scatter';
// @ts-ignore
import { VictoryAxis } from 'victory-axis';

interface BellProps {
  mean: number;
  stdev: number;
  x: number;
}
class VictoryLineState {
  data: {
    x: number;
    y: number;
  }[];
  transitionData: {
    x: number;
    y: number;
  }[];
  arrayData: number[][];
  style: React.CSSProperties;
}
type Coordinates = {
  x: number;
  y: number;
};
const BellCurve = ({ mean, stdev, x }: BellProps) => {
  console.log(mean, stdev, x);
  //const [bellMean, setBellMean] = useState<number>(64.58); //example
  //const [bellStdev, setBellStdev] = useState<number>(10.59); //example
  const [bellMean, setBellMean] = useState<number>(mean); //example
  const [bellStdev, setBellStdev] = useState<number>(stdev); //example
  const [bellXValues, setBellXValues] = useState<number[]>([]);
  const [bellYValues, setBellYValues] = useState<(number | null)[]>([]);
  const [victoryLineData, setVictoryLineData] = useState<VictoryLineState>(
    new VictoryLineState()
  );

  const [pointerCoordinates, setPointerCoordinates] = useState<Coordinates>({
    x,
    y: 0,
  });

  const densityNormal = (value: number, mean: number, stdev: number) => {
    const SQRT2PI = Math.sqrt(2 * Math.PI);
    stdev = stdev == null ? 1 : stdev;
    const z = (value - (mean || 0)) / stdev;
    return Math.exp(-0.5 * z * z) / (stdev * SQRT2PI);
  };

  //To Get X values for bell curve.
  useEffect(() => {
    // defining chart limits between which the graph will be plotted
    let lcl = bellMean - bellStdev * 6;
    let ucl = bellMean + bellStdev * 6;

    let ticks = [lcl];
    let steps = 100; // steps corresponds to the size of the output array
    let stepSize = Math.round(((ucl - lcl) / steps) * 10000) / 10000;
    let tickVal = lcl;
    for (let i = 0; i <= steps; i++) {
      ticks.push(Math.round(tickVal * 10000) / 10000); // rounding off to 4 decimal places
      tickVal = tickVal + stepSize;
    }
    setBellXValues(ticks); //array for X values
  }, [bellMean, bellStdev]);

  //To Get Y values for Bell curve.

  useEffect(() => {
    // Using PDF function from vega-statistics instead of importing the whole library
    densityNormal(pointerCoordinates.x, bellMean, bellStdev);
    let YValues = bellXValues.map((item: number) => {
      if (bellMean === null || bellStdev === undefined) {
        return null;
      } else {
        const pdfValue = densityNormal(item, bellMean, bellStdev);
        return pdfValue === Infinity ? null : pdfValue;
      }
    });
    setBellYValues(YValues); // array for Y values
  }, [bellXValues]);

  useEffect(() => {
    console.log('arrays: ', bellXValues);
    var arr_data = { data: [], transitionData: [], arrayData: [], style: null };
    bellXValues.map((numberX, index) => {
      arr_data.data.push({ x: numberX, y: bellYValues[index] });
    });
    console.log(arr_data);
    setVictoryLineData(arr_data);
    console.log(victoryLineData);
    const y = densityNormal(pointerCoordinates.x, bellMean, bellStdev);
    setPointerCoordinates({ x: pointerCoordinates.x, y: y });
  }, [bellYValues]);

  return (
    <VictoryChart maxDomain={{ x: 100, y: 0.1 }} minDomain={{ x: 0 }}>
      <VictoryAxis crossAxis={false} />
      <VictoryLine
        style={{
          data: { stroke: '#c43a31' },
          parent: { border: '1px solid #ccc' },
        }}
        data={victoryLineData.data}
      />
      {/*       We just need 1 scatter for representing the result
       */}
      <VictoryScatter
        symbol="circle"
        size={12}
        style={{
          data: { fill: '#c43a31' },
          labels: {
            fontSize: 14,
            verticalAnchor: 'start',
            textAnchor: 'middle',
            fill: 'dark',
          },
        }}
        labels={({ datum }) => `${datum.x}`}
        data={[{ x: pointerCoordinates.x, y: pointerCoordinates.y }]}
      />
    </VictoryChart>
  );
};

export default BellCurve;
