import { Component, OnInit } from '@angular/core';
import Peer from '../models/Peer';
import Fragment from '../models/Fragment';
import { PeersService } from '../services/peers.service';
import { FragmentsService } from '../services/fragments.service';
declare var jQuery: any;

@Component({
    selector: 'fragment',
    templateUrl: 'fragment.component.html'
})

export class FragmentComponent implements OnInit {

    private peersNumber = 6;
    private fragmentsNumber = 20;
    private blocksNumber = 5;
    private blockSize = 512;

    user: Peer;
    peers: Peer[];
    fragments: Fragment[];
    endGamePeers: Peer[] = [];
    endGameIntervals: any[] = [];
    endGameStarted = false;
    fragmentsStatistics: number[] = [];
    activeColumn: number = -1;

    constructor(
        private peersService: PeersService,
        private fragmentsService: FragmentsService) {
    }

    ngOnInit() {
        this.user = this.peersService.generateRandomPeer();

        this.peers = this.peersService.generateRandomPeers(this.peersNumber);
        this.fragments = this.fragmentsService.generateFragments(this.fragmentsNumber, this.blocksNumber, this.blockSize);

        let hasAllFragmentsIdx = Math.floor(Math.random() * this.peers.length);
        this.peers[hasAllFragmentsIdx].fragments = this.fragments.slice();

        this.peers.forEach((peer, idx) => {
            if (idx !== hasAllFragmentsIdx) {
                const number = Math.floor(Math.random() * this.fragments.length);

                for (let i = 0; i < number; i++) {
                    let randomFragment = this.fragments[Math.floor(Math.random() * this.fragments.length)];

                    if (!this.hasFragment(peer, randomFragment)) {
                        peer.fragments.push(randomFragment);
                    }
                }
            }
        });
    }

    hasFragment(peer: Peer, fragment: Fragment) {
        return peer.fragments.filter(peerFragment => peerFragment.hash === fragment.hash).length > 0;
    }

    clearFragmentsParams(property: string): void {
        this.peers.forEach(peer => {
            peer.fragments.forEach(fragment => delete fragment.params[property]);
        });
    }

    step(): void {
        this.clearFragmentsParams('ip');

        if (this.user.fragments.length < 4) {
            this.nextRandomFragment();

        } else if (this.user.fragments.length < this.fragments.length - 1) {
            this.clearFragmentsParams('rarest');
            this.nextRarestFragment();
        };
    }

    nextRandomFragment(): void {
        const randomPeerIdx = Math.floor(Math.random() * this.peers.length);
        const randomPeer = this.peers[randomPeerIdx];

        const randomFragmentIdx = Math.floor(Math.random() * randomPeer.fragments.length);
        const randomFragment = randomPeer.fragments[randomFragmentIdx];

        if (randomFragment && !this.hasFragment(this.user, randomFragment)) {
            this.user.fragments.push(randomFragment);
            randomFragment.params.ip = randomPeer.ip;

        } else {
            this.nextRandomFragment();
        }
    }

    startEndGame(): void {
        this.endGamePeers = this.peers.filter(peer => {
            return peer.fragments.filter(fragment => !this.hasFragment(this.user, fragment)).length > 0;
        });

        this.endGamePeers.forEach(peer => {
            setTimeout(() => {
                let percent = 0;

                let interval = setInterval(() => {
                    percent++;
                    jQuery('#' + peer.id).progress({
                        percent: percent
                    });

                    if (percent === 100) {
                        this.endGameIntervals.forEach(interval => clearInterval(interval));
                        peer.fragments.forEach(fragment => {
                            if (!this.hasFragment(this.user, fragment)) {
                                this.user.fragments.push(fragment);
                            };
                        });
                    }
                }, 1000 / peer.speed);

                this.endGameIntervals.push(interval);
            }, 1000);
        });
    }

    inEndGame(peer): boolean {
        return this.endGamePeers.filter(endGamePeer => endGamePeer.ip === peer.ip).length > 0;
    }

    nextRarestFragment(): void {
        if (!this.fragmentsStatistics.length) {
            this.peers.forEach(peer => {
                peer.fragments.forEach(fragment => {
                    let idx = this.fragments.indexOf(fragment);

                    this.fragmentsStatistics[idx] = isNaN(this.fragmentsStatistics[idx])
                        ? 1
                        : ++this.fragmentsStatistics[idx];

                });
            });

            this.fragments.forEach((fragment, idx) => {
                fragment.params.quantity = this.fragmentsStatistics[idx];
            });
        }

        let sortedFragments = this.fragments.slice().sort((first, second) => {
            return first.params.quantity - second.params.quantity;
        }).filter(sortedFragment => !this.hasFragment(this.user, sortedFragment));

        let nextSortedFragment = sortedFragments.slice(0, 1)[0];
        this.user.fragments.push(nextSortedFragment);

        this.fragments.forEach(fragment => {
            if (fragment.hash === nextSortedFragment.hash) {
                fragment.params.rarest = true;
            };
        });

        if (this.user.fragments.length === this.fragments.length - 1) {
            this.endGameStarted = true;
            this.clearFragmentsParams('rarest');

            this.fragments.filter(fragment => {
                return !this.hasFragment(this.user, fragment);

            }).forEach(fragment => {
                fragment.params.rarest = true;
            });
        }
    }
}