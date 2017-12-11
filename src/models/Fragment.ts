import Block from './Block';

class Fragment {
    constructor(public blocks: Block[], public hash: string, public params: any = {}) {}
}

export default Fragment;