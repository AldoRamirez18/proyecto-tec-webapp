import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';

import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit{
  public token: string = "";
  public lista_materias: any[] = [];
  public rol: string = "";
  public name_user:string = "";
  public dataColumns:string[];

  displayedColumns: string[] = [];
  dataSourceMateria = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSourceMateria.paginator = this.paginator;
  }

  constructor(
    private facadeService: FacadeService,
    private materiasService: MateriasService,
    private router: Router,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.token = this.facadeService.getSessionToken();

    if(this.token == ""){
      this.router.navigate([""]);
    }else{
      this.rol = this.facadeService.getUserGroup();
      this.name_user = this.facadeService.getUserCompleteName();

      // Obtener Lista de Usuarios
      this.obtenerMaterias();

      // Iniciar Paginator
      this.initPaginator();

      // Mostrar Columnas
      this.mostrarColumnas();
    }
  }

  // Función Para Obtener la Lista de Materias
  public obtenerMaterias(){
    this.materiasService.obtenerListaMaterias().subscribe({
      next: (response)=>{
        this.lista_materias = response;
        //console.log("Lista materias: ", this.lista_materias);
        if(this.lista_materias.length > 0){
          this.dataSourceMateria = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);
        }
      },
      error: (error)=>{
        alert("No se pudo obtener la lista de materias");
      }
    });
  }

  // Paginador
  public initPaginator(){
    setTimeout(() => {
      this.dataSourceMateria.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
  }

  goRegistrarMateria(){
    this.router.navigate(['/registro-materia']);
  }

  goEditar(nrc:number){
    this.router.navigate(["registro-materia/"+nrc]);
  }

  goEliminarMateria(nrc:number){
    //console.log("User:", idUser);
    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: nrc, rol: 'materia'}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });
    //Esta se ejecuta después de un evento que cierra el modal
    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Materia eliminada");
        //Recargar página
        alert("Materia eliminada correctamente");
        window.location.reload();
      }else{
        alert("Materia no eliminada ");
        console.log("No se eliminó la materia");
      }
    });
  }

  // Función Para mostrar o no las Columnas
  public mostrarColumnas(){
    if(this.rol == "administrador"){
      this.displayedColumns = ['nrc', 'nombre', 'seccion', 'dias', 'horaInicio', 'horaFinal', 'salon', 'programa', 'maestro', 'creditos', 'editar', 'eliminar'];
    }else if(this.rol == "maestro"){
      this.displayedColumns = ['nrc', 'nombre', 'seccion', 'dias', 'horaInicio', 'horaFinal', 'salon', 'programa', 'creditos'];
    }
  }
}

export interface DatosMateria {
  nrc: number,
  nombre: string;
  seccion: number;
  dias: string;
  horaInicio: string;
  horaFinal: string,
  salon: string,
  programa: string,
  maestro: string,
  creditos: number
}
