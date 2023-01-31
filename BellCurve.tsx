import { useEffect, useState } from 'react';
import React = require('react');
// @ts-ignore
import { VictoryChart } from 'victory-chart';
// @ts-ignore
import { VictoryLine } from 'victory-line';

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
const BellCurve: React.FC = () => {
  const [bellMean, setBellMean] = useState<number>(64.58); //example
  const [bellStdev, setBellStdev] = useState<number>(10.59); //example
  const [bellXValues, setBellXValues] = useState<number[]>([]);
  const [bellYValues, setBellYValues] = useState<(number | null)[]>([]);
  const [victoryLineData, setVictoryLineData] = useState<VictoryLineState>(
    new VictoryLineState()
  );
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
    const densityNormal = (value: number, mean: number, stdev: number) => {
      const SQRT2PI = Math.sqrt(2 * Math.PI);
      stdev = stdev == null ? 1 : stdev;
      const z = (value - (mean || 0)) / stdev;
      return Math.exp(-0.5 * z * z) / (stdev * SQRT2PI);
    };

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
    /*     if (!!bellXValues.length || !!bellYValues.length) {
      return;
    } */
    /*   interface VictoryLineDemoState {
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
    } */
    var arr_data = { data: [], transitionData: [], arrayData: [], style: null };
    bellXValues.map((numberX, index) => {
      arr_data.data.push({ x: numberX, y: bellYValues[index] });
    });
    console.log(arr_data);
    setVictoryLineData(arr_data);
    console.log(victoryLineData);
  }, [bellXValues, bellYValues]);

  return (
    <VictoryChart maxDomain={{ x: 100 }}>
      {/*    <VictoryLine data={[
      { x: 1, y: -2 },
      { x: 2, y: 1 },
      { x: 3, y: -1 },
      { x: 4, y: -3 }
    ]} /> */}
      <VictoryLine data={victoryLineData.data} />
    </VictoryChart>
  );
};

export default BellCurve;
