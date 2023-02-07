// @ts-ignore
import { VictoryChart } from 'victory-chart';
// @ts-ignore
import { VictoryLine } from 'victory-line';
// @ts-ignore
import { VictoryScatter } from 'victory-scatter';
// @ts-ignore
import { VictoryAxis } from 'victory-axis';
import React = require('react');
import useBellCurve from './hooks/BellCurve';

const BellCurveContainer = () => {
  const { victoryLineData: lineData1, pointerCoordinates: pointer1 } =
    useBellCurve({
      mean: 64.48,
      stdev: 10.59,
      x: 44,
    });

  const { victoryLineData: lineData2, pointerCoordinates: pointer2 } =
    useBellCurve({
      mean: 46.11,
      stdev: 9.48,
      x: 57,
    });
  return (
    <VictoryChart maxDomain={{ x: 100, y: 0.1 }} minDomain={{ x: 0 }}>
      <VictoryAxis crossAxis={false} />
      <VictoryLine
        style={{
          data: { stroke: '#c43a31' },
          parent: { border: '1px solid #ccc' },
        }}
        data={lineData1.data}
      />
      <VictoryLine
        style={{
          data: { stroke: '#E6E600' },
          parent: { border: '1px solid #ccc' },
        }}
        data={lineData2.data}
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
        data={[{ x: pointer1.x, y: pointer1.y }]}
      />
      <VictoryScatter
        symbol="circle"
        size={12}
        style={{
          data: { fill: '#E6E600' },
          labels: {
            fontSize: 14,
            verticalAnchor: 'start',
            textAnchor: 'middle',
            fill: 'dark',
          },
        }}
        labels={({ datum }) => `${datum.x}`}
        data={[{ x: pointer2.x, y: pointer2.y }]}
      />
    </VictoryChart>
  );
};

export default BellCurveContainer;
