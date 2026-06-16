import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { useMemo } from 'react';

function GraficoKcal() {

   const seriesData = [320, 450, 280, 580, 390, 510, 220, 830, 350, 480, 270];
   const seriesId = 'best';
   const xAxisId = 'x-axis';

   const highestDataIndex = useMemo(() => {
      return seriesData.indexOf(Math.max(...seriesData));
   }, [seriesData]);

   return (
      <div>
         <LineChart
            grid={{ horizontal: true }}
            sx={{
               [`.${axisClasses.root}`]: {
                  [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                     stroke: '#ffffff',
                     strokeWidth: 3,
                  },
                  [`.${axisClasses.tickLabel}`]: {
                     fill: '#ffffff',
                  },
               },
               [`.${chartsGridClasses.line}`]: {
                  strokeDasharray: '5 3',
                  strokeWidth: 1,
                  stroke: '#ffffff',
                  opacity: 0.3,
               },
            }}
            xAxis={[{
               id: xAxisId,
               scaleType: 'point',
               data: ['1\nSeg', '3\nQua', '5\nQui', '6\nSex', '8\nDom', '10\nTer', '13\nQui', '15\nSáb', '17\nSeg', '19\nQua', '20\nQui'],
               height: 28,
            }]}
            yAxis={[{ data: [0, 200, 400, 600, 800, 10000] }]}
            series={[{
               id: seriesId,
               data: seriesData,
               area: true,
               color: '#ffb84db6',
            }]}
            height={300}
            highlightedAxis={[{ axisId: xAxisId, dataIndex: highestDataIndex }]}
            tooltip={{
               trigger: 'axis',
               item: {
                  seriesId: seriesId,
                  dataIndex: highestDataIndex,
               },
            }}
         />
      </div>
   );
}

export default GraficoKcal;