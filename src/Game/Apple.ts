import Coord from '@/Utils/Coord';

export default class Apple {
    
    private coord1: Coord;
    private coord2: Coord;

    constructor(coord1: Coord, coord2: Coord) {
        this.coord1 = coord1;
        this.coord2 = coord2;
    }

    public get x1(): number {
        return this.coord1.x;
    }

    public get x2(): number {
        return this.coord2.x;
    }

    public get y1(): number {
        return this.coord1.y;
    }

    public get y2(): number {
        return this.coord2.y;
    }

}
