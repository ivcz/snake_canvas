import Coord from './Coord';

export default class PathNode extends Coord {
    public gScore: number;
    public fScore: number;
    public prev?: PathNode;

    constructor(x: number, y: number, fScore: number = 0, gScore: number = 0, prev?: PathNode) {
        super(x, y);
        this.fScore = fScore;
        this.gScore = gScore;
        this.prev = prev;
    }

    getCoord(): Coord {
        return new Coord(this.x, this.y);
    }
}
