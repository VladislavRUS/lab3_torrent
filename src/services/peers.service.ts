import { Injectable } from '@angular/core';
import Peer from '../models/Peer';

@Injectable()
export class PeersService {

    constructor() { }

    generateRandomPeers(size: number): Peer[] {
        const peers = [];

        for (let i = 0; i < size; i++) {
            peers.push(this.generateRandomPeer());
        }

        return peers;
    }

    generateRandomPeer(): Peer {
        return new Peer(
            this.generateRandomId(),
            this.generateRandomSpeed(),
            this.generateRandomIp(),
            this.generateRandomPort(),
            false,
            false
        );
    }

    generateRandomPort(): number {
        return Math.floor(Math.random() * (8000) + 1000);
    }

    generateRandomIp(): string {
        let ip = '';

        for (let i = 0; i < 4; i++) {
            ip += (Math.floor(Math.random() * 155) + 100).toString();
            if (i !== 3) {
                ip += '.';
            }
        }

        return ip;
    }

    generateRandomSpeed(): number {
        return parseFloat((Math.random() * 9 + 1).toFixed(2));
    }

    generateRandomId(): string {
        return Math.floor(Math.random() * 1000000).toString();
    }
}