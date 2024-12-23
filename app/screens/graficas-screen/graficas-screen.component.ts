import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from '../../services/facade.service';
import { ChartDataset } from 'chart.js';

interface CharData{
  labels: string[];
  datasets: ChartDataset[];
}
interface CharDataset{
  data: number[];
  label: string[];
  backgroundColor: string | string[];
}

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})

export class GraficasScreenComponent implements OnInit{
  //Variables
  public data : any = {};
  public token : string ='';
  //public total_user: any = {};

  constructor(
    private administradoresServices: AdministradoresService,
    private facadeService: FacadeService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ){}

  ngOnInit(): void {
    this.token = this.facadeService.getSessionToken();
    if(this.token === ''){
      this.router.navigate(['']);
    }

    this.obtenerTotalUsers();
    // console.log("Data: ", this.doughnutChartData);
  }

  //Agregar chartjs-plugin-datalabels
  //Histograma
  lineChartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data:[89, 34, 43, 54, 28, 74, 93],
        label: 'Registro de materias',
        backgroundColor: '#F88406'
      }
    ]
  }
  lineChartOption = {
    responsive:false
  }
  lineChartPlugins = [ DatalabelsPlugin ];

  //Barras
  barChartData = {
    labels: ["Desarrollo Web", "Minería de Datos", "Redes", "Móviles", "Matemáticas"],
    datasets: [
      {
        data:[34, 43, 54, 28, 74],
        label: 'Registro de materias',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  }
  barChartOption = {
    responsive:false
  }
  barChartPlugins = [ DatalabelsPlugin ];
  //Circular
  pieChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0,0,0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  }
  pieChartOption = {
    responsive:true,
    maintainAspectRatio: false,
  };
  pieChartPlugins = [ DatalabelsPlugin ];

  // Doughnut
  doughnutChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0,0,0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  }
  doughnutChartOption = {
    responsive:true,
    maintainAspectRatio: false,
  };
  doughnutChartPlugins = [ DatalabelsPlugin ];

  obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe({
      next: (data) => {
        //console.log('Datos:', data);
        this.updateChartData(data);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al Obtener Datos', error);
      },
    });
  }

  updateChartData(data: any) {
    this.pieChartData.datasets[0].data = [data.admins, data.maestros, data.alumnos];
    this.doughnutChartData.datasets[0].data = [data.admins, data.maestros, data.alumnos];

    // Reasignar Datos para Activar Actualizaciones de Gráficos
    this.lineChartData = { ...this.lineChartData };
    this.barChartData = { ...this.barChartData };
    this.pieChartData = { ...this.pieChartData };
    this.doughnutChartData = { ...this.doughnutChartData };

    this.cdr.detectChanges();
  }

}
