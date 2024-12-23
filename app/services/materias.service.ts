import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

// Servicios
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { FacadeService } from './facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorsService: ErrorsService,
    private facadeService: FacadeService,
  ) { }

  public esquemaMateria(){
    return {
      'nrc': '',
      'nombre': '',
      'seccion': '',
      'dias_json': [],
      'horaInicio': '',
      'horaFin': '',
      'salon': '',
      'programa': '',
    }
  }

  public validarMateria(data: any, editar:any){
    console.log("Validando Materia: ", data);
    let error: any = [];

    if(!this.validatorService.required(data["nrc"])){
      error["nrc"] = this.errorsService.required;
    }else if(!this.validatorService.numeric(data["nrc"])){
      error["nrc"] = this.errorsService.numeric;
    }

    if(!this.validatorService.required(data["nombre"])){
      error["nombre"] = this.errorsService.required;
    }

    if(!this.validatorService.required(data["seccion"])){
      error["seccion"] = this.errorsService.required;
    }else if(!this.validatorService.numeric(data["seccion"])){
      error["seccion"] = this.errorsService.numeric;
    }

    if(data["dias_json"].length == 0){
      //alert("Debes seleccionar materias para poder registrarte.");
      error["dias_json"] = this.errorsService.required;
    }

    if(!this.validatorService.required(data["horaInicio"])){
      error["horaInicio"] = this.errorsService.required;
    }

    if(!this.validatorService.required(data["horaFin"])){
      error["horaFin"] = this.errorsService.required;
    }

    if(!this.validatorService.required(data["salon"])){
      error["salon"] = this.errorsService.required;
    }

    if(!this.validatorService.required(data["programa"])){
      error["programa"] = this.errorsService.required;
    }

    if(!this.validatorService.required(data["profesor_asignado"])){
      error["profesor_asignado"] = this.errorsService.required;
    }

    if(!this.validatorService.required(data["creditos"])){
      error["creditos"] = this.errorsService.required;
    }

    return error;
  }

  // Servicios HTTP

  // Servicio Para Registrar Materia
  public registrarMateria (data: any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/materia/`,data, httpOptions);
  }

  // Obtener Materia por NRC
  public getMateriaByNRC (nrc: Number): Observable <any>{
    return this.http.get<any>(`${environment.url_api}/materia/?nrc=${nrc}`, httpOptions);
  }

  // Obtener Lista Materias
  public obtenerListaMaterias (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, {headers:headers});
  }

  // Actualizar Materia
  public editarMateria (data: any): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/materia-edit/`, data, {headers:headers});
  }

  // Eliminar Materia
  public eliminarMateria(nrc: number): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/materia-edit/?nrc=${nrc}`, {headers:headers});
  }
}
