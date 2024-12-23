import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Servicios
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';
import { EditarUserModalComponent } from 'src/app/modals/editar-user-modal/editar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';

declare var $: any;

@Component({
  selector: 'app-registro-materia-screen',
  templateUrl: './registro-materia-screen.component.html',
  styleUrls: ['./registro-materia-screen.component.scss'],
})

export class RegistroMateriaScreenComponent implements OnInit {

  // Propiedades
  public token:string = "";
  public editar:boolean = false;
  public materia:any = {};
  public nrc:Number = 0;
  public lista_maestros:any = [];
  @Input() rol: string = "materia";
  // Check
  public valoresCheckbox: any = [];
  public dias_json: any [] = [];


  // Errores
  public errors:any = {};

  // Array de Días - Checkbox
  public dias:any[]= [
    {value: '1', nombre: 'Lunes'},
    {value: '2', nombre: 'Martes'},
    {value: '3', nombre: 'Miercoles'},
    {value: '4', nombre: 'Jueves'},
    {value: '5', nombre: 'Viernes'},
    {value: '6', nombre: 'Sabado'},
  ];

  constructor(
    private facadeService: FacadeService,
    private materiasService: MateriasService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private maestrosService: MaestrosService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.token = this.facadeService.getSessionToken();

    if(this.token == ""){
      this.router.navigate(['']);
    }else{
      this.obtenerMaestros()
      this.materia = this.materiasService.esquemaMateria();
      //console.log("Materia: ", this.materia);

      if(this.activatedRoute.snapshot.params['nrc'] != undefined){
        // NRC Existe, Entonces Estamos Editando
        this.editar = true;
        this.nrc = this.activatedRoute.snapshot.params['nrc'];
        this.obtenerMateriaByNRC();
      }


    }
  }

  public regresar(){
    this.location.back();
  };

  public registrarMateria(){
    // Validación de Materia
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
      //console.log("Materia: ", this.materia);
    }

    // Validación Correcta, Registrar Materia
    this.materiasService.registrarMateria(this.materia).subscribe({
      next: (response) => {
        alert("Materia Registrada Correctamente");
        this.router.navigate(["home"]);
      },
      error: (error) => {
        alert("¡Error!: No se Pudo Registrar Materia");
      }
    });
  }

  public obtenerMateriaByNRC(){
    this.materiasService.getMateriaByNRC(this.nrc).subscribe({
      next: (response)=>{
        this.materia = response;
        this.materia.horaInicio = this.materia.horaInicio.slice(0, -3);
        this.materia.horaFin = this.materia.horaFin.slice(0, -3);
      },
      error: (error)=>{
        alert("Datos de Materia no Obtenidos");
      }
    });
  }

  public actualizarMateria(){
    //Validación
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");
    this.materia.dias_json = [...new Set(this.materia.dias_json)];

    const dialogRef = this.dialog.open(EditarUserModalComponent,{
      data: {materia: this.materia, rol: 'materia'}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isUpdated){
        console.log("Materia actualizada");
        //Recargar página
        alert("Materia actualizada correctamente");

      }else{
        alert("Materia no actualizada ");
        console.log("No se actualizó la materia");
      }
    });

    // this.materiasService.editarMateria(this.materia).subscribe(
    //   (response)=>{
    //     alert("Materia editado correctamente");
    //     console.log("Materia editado: ", response);
    //     //Si se editó, entonces mandar al home
    //     this.router.navigate(["home"]);
    //   }, (error)=>{
    //     alert("No se pudo editar la materia");
    //   }
    // );

  }

  // Función Para Detectar Cambio de Checkbox
  public checkboxChange(event:any){
    if(event.checked){
      this.materia.dias_json.push(event.source.value)
    }else{
      //console.log(event.source.value);
      this.materia.dias_json.forEach((materia: any, i: any) => {

        if(materia == event.source.value){
          this.materia.dias_json.splice(i,1)
        }
      });
    }
  }

  // Función Para Detectar el Cambio de Select
  public revisarSeleccion(nombre: string){
    if(this.materia.dias_json){
      var busqueda = this.materia.dias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

public obtenerMaestros(){
  this.maestrosService.obtenerListaMaestros().subscribe(
    (response)=>{
      this.lista_maestros = response
        .filter((maestro:any)=> maestro.user)
        .map((maestro:any)=>({
          id: maestro.id,
          nombreCompleto:`${maestro.user.first_name} ${maestro.user.last_name}`,
          email: maestro.user.email
        }));
      console.log('Lista de maestros: ', this.lista_maestros);

    },
     (error)=>{
      console.error('Error al obtener la lista de maestros: ', error);
      this.errors.global - error.error.message;
      alert("No se pudo obtener la lista de maestros");
    }
  );
}

public soloLetras(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);
  // Permitir solo letras (mayúsculas y minúsculas) y espacio
  if (
    !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
    !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
    charCode !== 32                         // Espacio
  ) {
    event.preventDefault();
  }
}

public soloNumeros(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);
  // Permitir solo letras (mayúsculas y minúsculas) y espacio
  if (
    !(charCode >= 48 && charCode <= 57))  // Letras mayúsculas
    event.preventDefault();
  }
}
