import { Injectable } from '@angular/core';
import Fragment from '../models/Fragment';
import Block from '../models/Block';

@Injectable()
export class FragmentsService {

    constructor() { }

    generateFragments(fragmentsNumber: number, blocksNumber: number, blockSize: number): Fragment[] {
        const fragments = [];

        for (let i = 0; i < fragmentsNumber; i++) {
            fragments.push(this.generateFragment(blocksNumber, blockSize));
        }

        return fragments;
    }

    generateFragment(blocksNumber: number, blockSize: number) {
        const blocks = this.generateBlocks(blocksNumber, blockSize);

        return new Fragment(blocks, this.generateHash());
    }

    generateBlocks(amount, size): Block[] {
        const blocks = [];

        for (let i = 0; i < amount; i++) {
            blocks.push(this.generateBlock(size));
        }

        return blocks;
    }

    generateBlock(size): Block {
        return new Block(size, this.generateHash());
    }

    generateHash(): string {
        let hash = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 32; i++)
            hash += possible.charAt(Math.floor(Math.random() * possible.length));

        return hash;
    }
}