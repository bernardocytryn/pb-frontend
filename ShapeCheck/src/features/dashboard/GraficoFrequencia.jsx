//import styles from './GraficoFrequencia.module.css'
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';


function GraficoFrequencia() {

   return (
      <div>
         <BarChart
            sx={{
               [`.${axisClasses.root}`]: {
                  [`.${axisClasses.tickLabel}`]: {
                     fill: '#ffffff',
                  },
               }
            }}
            xAxis={[{ data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], height: 28 }]}
            yAxis={[
               {
                  tickLabelStyle: {
                     fill: '#ec407900',
                  },
               },
            ]}
            series={[{ data: [2, 1, 2, 3, 1, 1, 1] }]}
            height={300}
         />
      </div>
   );
}

export default GraficoFrequencia;