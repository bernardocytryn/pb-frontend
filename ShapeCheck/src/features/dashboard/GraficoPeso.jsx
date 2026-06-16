import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

function GraficoPeso() {
   return (
      <div>
         <LineChart
            sx={{
               [`.${axisClasses.root}`]: {
                  [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                     stroke: '#ffffff',
                     strokeWidth: 3,
                  },
                  [`.${axisClasses.tickLabel}`]: {
                     fill: '#ffffff',
                  },
               }
            }}
            xAxis={[{
               scaleType: 'point',
               data: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan'],
               height: 28,
            }]}
            series={[
               {
                  data: [72.5, 71.05, 70.20, 69.65, 68.70, 68.90],
                  curve: 'linear',
                  showMark: true,
                  color: '#e3632c'
               },
            ]}
            height={300}
         />
      </div>
   );
}

export default GraficoPeso;