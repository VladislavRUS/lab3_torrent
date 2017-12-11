import { Component, OnInit } from '@angular/core';
import Peer from '../models/Peer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private size = 20;
  user: Peer;
  peers: Peer[];
  choked: Peer[] = [];
  event: any = {};

  fastestInterval = null;
  randomInterval = null;

  constructor() {
    this.event.title = '';
    this.event.description = '';
  }

  ngOnInit(): void {
    this.peers = [];

    for (let i = 0; i < this.size; i++) {
      this.peers.push(this.generateRandomPeer());
    }

    this.user = this.generateRandomPeer();
  }

  start(): void {
    this.fastestInterval = setInterval(() => {

      this.peers = this.peers.sort((first, second) => {
        return first.speed - second.speed;
      });

      this.choked = [...this.peers.slice(0, 3)];

      this.updateEvent('3 fastest', [...this.choked.map(chokedPeer => chokedPeer.id)].toString());

    }, 1000);

    this.randomInterval = setInterval(() => {

      let randomPeer = this.peers[Math.floor(Math.random() * this.peers.length)];

      
      this.choked.push(randomPeer);

      this.updateEvent('Random', randomPeer.id);

    }, 3000);
  }

  stop(): void {
    clearInterval(this.fastestInterval);
    clearInterval(this.randomInterval);
  }

  isInChoked(peer: Peer): boolean {
    return this.choked.filter(chokedPeer => chokedPeer.id === peer.id).length > 0;
  };

  updateEvent(title: string, description: string) {
    this.event.title = title;
    this.event.description = description;
  };

  generateRandomPeer(): Peer {
    return new Peer(
      this.generateRandomId(),
      this.generateRandomSpeed(),
      this.generateRandomIp(),
      this.generateRandomPort()
    );
  }

  generateRandomPort(): number {
    return Math.floor(Math.random() * (8000) + 1000);
  };

  generateRandomIp(): string {
    let ip = '';

    for (let i = 0; i < 4; i++) {
      ip += (Math.floor(Math.random() * 155) + 100).toString();
      if (i !== 3) {
        ip += '.';
      }
    }

    return ip;
  };

  generateRandomSpeed(): number {
    return Math.floor(Math.random() * 9 + 1);
  }

  generateRandomId(): string {
    return Math.floor(Math.random() * 1000000).toString();
  }
}
