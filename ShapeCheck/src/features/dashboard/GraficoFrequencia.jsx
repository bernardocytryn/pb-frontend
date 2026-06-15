//import styles from './GraficoFrequencia.module.css'
import { BarChart } from '@mui/x-charts/BarChart';

function GraficoFrequencia() {

   return (
      <div>
         <BarChart
            xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
            series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
            height={300}
         />
      </div>
   );
}

export default GraficoFrequencia;