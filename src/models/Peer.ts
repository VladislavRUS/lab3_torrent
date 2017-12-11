class Peer {

    constructor(
        public id: string,
        public speed: number,
        public ip: string,
        public port: number,
        public unchocked: boolean,
        public interested: boolean
    ) { }

}

export default Peer;
