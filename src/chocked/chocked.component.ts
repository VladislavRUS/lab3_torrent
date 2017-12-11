import { Component, OnInit } from '@angular/core';
import Peer from '../models/Peer';
import { PeersService } from '../services/peers.service';

@Component({
    selector: 'chocked',
    templateUrl: './chocked.component.html'
})
export class ChockedComponent implements OnInit {
    private size = 10;
    user: Peer;
    peers: Peer[];
    choked: Peer[] = [];
    messages: any[] = [];
    event: any = {};
    randomPeerId: string;

    fastestInterval = null;
    randomInterval = null;
    updatePeersInterval = null;

    constructor(private peersService: PeersService) {
        this.event.title = '';
        this.event.description = '';
    }

    ngOnInit(): void {
        this.peers = [];

        for (let i = 0; i < this.size; i++) {
            this.peers.push(this.peersService.generateRandomPeer());
        }

        this.user = this.peersService.generateRandomPeer();
    }

    start(): void {
        this.fastestInterval = setInterval(() => {
            this.peers.map(peer => {
                if (peer.id !== this.randomPeerId) {
                    peer.unchocked = false;
                }
            });

            this.peers = this.peers.sort((first, second) => {
                return second.speed - first.speed;
            });

            this.peers.slice(0, 3).forEach(peer => peer.unchocked = true);

            const title = 'Sorted peers';
            let description = '3 fastests: ';

            const ips = this.peers.slice(0, 3).map(peer => peer.ip);

            ips.forEach((id, idx) => {
                description += id;
                if (idx !== ips.length - 1) {
                    description += ', ';
                }
            });

            this.addMessage(title, description);

        }, 1000);

        this.randomInterval = setInterval(() => {

            if (this.randomPeerId) {
                this.peers.forEach(peer => {
                    if (peer.id === this.randomPeerId) {
                        peer.unchocked = false;
                    }
                });
            }

            const randomPeer = this.peers[Math.floor(Math.random() * (this.peers.length - 3) + 3)];
            randomPeer.unchocked = true;

            this.randomPeerId = randomPeer.id;

            const title = 'Randomly unchocked peer';
            const description = randomPeer.ip;

            this.addMessage(title, description);
        }, 3000);

        this.updatePeersInterval = setInterval(() => {
            const deletePeersNumber = Math.floor(Math.random() * 5);

            for (let i = 0; i < deletePeersNumber; i++) {
                const idx = Math.floor(Math.random() * this.peers.length);
                this.peers.splice(0, 1);
                this.peers.push(this.peersService.generateRandomPeer());
            }

            const title = 'New peers';
            const description = deletePeersNumber.toString();

            this.addMessage(title, description);
        }, 5000);
    }

    stop(): void {
        clearInterval(this.fastestInterval);
        clearInterval(this.randomInterval);
        clearInterval(this.updatePeersInterval);
    }

    addMessage(header: string, description: string) {
        this.messages.push({
            header: header,
            description: description
        });
    }
}
