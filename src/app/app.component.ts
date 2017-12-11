import { Component, OnInit } from '@angular/core';
import Peer from '../models/Peer';
import { race } from 'q';
import { PeersService } from '../services/peers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
}
