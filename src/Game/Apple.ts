import Coord from '@/Utils/Coord';

import Field from './Field';

export default class Apple {
    
    private coord1: Coord;
    private coord2: Coord;

    constructor(coord1: Coord, coord2: Coord) {
        this.coord1 = coord1;
        this.coord2 = coord2;
    }

    public draw(field: Field): void {
        field.context.fillStyle = 'red';
        field.context.fillRect(
            this.coord1.x,
            this.coord1.y,
            this.coord2.x - this.coord1.x,
            this.coord2.y - this.coord1.y
        );
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
