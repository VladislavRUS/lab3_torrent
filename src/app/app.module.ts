import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { FragmentComponent } from '../fragment/fragment.component';
import { ChockedComponent } from '../chocked/chocked.component';
import { PeersService } from '../services/peers.service';
import { FragmentsService } from '../services/fragments.service';

const routes: Routes = [
  { path: 'chocked', component: ChockedComponent },
  { path: 'fragment', component: FragmentComponent },
  { path: '', redirectTo: '/chocked', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    FragmentComponent,
    ChockedComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    PeersService,
    FragmentsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
