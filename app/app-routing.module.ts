import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { AdminScreenComponent } from './services/admin-screen/admin-screen.component';
import { AlumnosScreenComponent } from './services/alumnos-screen/alumnos-screen.component';
import { MaestrosScreenComponent } from './services/maestros-screen/maestros-screen.component';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';
import { MateriasScreenComponent } from './screens/materias-screen/materias-screen.component';
import { RegistroMateriaScreenComponent } from './screens/registro-materia-screen/registro-materia-screen.component';

const routes: Routes = [
  //Pantalla principal del login
  { path: '', component: LoginScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios', component: RegistroUsuariosScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios/:rol/:id', component: RegistroUsuariosScreenComponent, pathMatch: 'full' },
  { path: 'home', component: HomeScreenComponent, pathMatch: 'full' },
  { path: 'alumnos', component: AlumnosScreenComponent, pathMatch: 'full' },
  { path: 'maestros', component: MaestrosScreenComponent, pathMatch: 'full' },
  { path: 'administrador', component: AdminScreenComponent, pathMatch: 'full' },
  { path: 'graficas', component: GraficasScreenComponent, pathMatch: 'full' },
  { path: 'materias', component: MateriasScreenComponent, pathMatch:'full' },
  { path: 'registro-materia', component: RegistroMateriaScreenComponent, pathMatch:'full' },
  { path: 'registro-materia/:nrc', component: RegistroMateriaScreenComponent, pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
