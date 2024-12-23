import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-editar-user-modal',
  templateUrl: './editar-user-modal.component.html',
  styleUrls: ['./editar-user-modal.component.scss']
})
export class EditarUserModalComponent implements OnInit{
  public rol: string = "";

  constructor(
    private router: Router,
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private alumnosService: AlumnosService,
    private materiasService: MateriasService,
    private dialogRef: MatDialogRef<EditarUserModalComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.rol = this.data.rol;
  }

  public cerrar_modal(){
    this.dialogRef.close({isUpdated:false});
  }

  public ActualizarUser(){
    if(this.rol == "administrador"){
      this.administradoresService.editarAdmin(this.data.admin).subscribe(
        (response) => {
          console.log("Admin actualizado: ", response);
          this.dialogRef.close({isUpdated:true});
          this.router.navigate(["home"]);
        },(error) =>{
          console.log("Error al actualizar admin: ", error);
          this.dialogRef.close({isUpdated:false});
        }
      );

    }else if(this.rol == "maestro"){
      this.maestrosService.editarMaestro(this.data.maestro).subscribe(
        (response) => {
          console.log("Maestro actualizado: ", response);
          this.dialogRef.close({isUpdated:true});
          this.router.navigate(["maestros"]);
        },(error) =>{
          console.log("Error al actualizar maestro: ", error);
          this.dialogRef.close({isUpdated:false});
        }
      );

    }if(this.rol == "alumno"){
      this.alumnosService.editarAlumno(this.data.alumno).subscribe(
        (response) => {
          console.log("Alumno actualizado: ", response);
          this.dialogRef.close({isUpdated:true});
          this.router.navigate(["alumnos"]);
        },(error) =>{
          console.log("Error al actualizar alumno: ", error);
          this.dialogRef.close({isUpdated:false});
        }
      );

    }if(this.rol == "materia"){
      this.materiasService.editarMateria(this.data.materia).subscribe(
        (response) => {
          console.log("Materia actualizada: ", response);
          this.dialogRef.close({isUpdated:true});
          this.router.navigate(["materias"]);
        },(error) =>{
          console.log("Error al actualizar materia: ", error);
          this.dialogRef.close({isUpdated:false});
        }
      );
    }
  }
}
