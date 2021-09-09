import Coord from '@/Utils/Coord';
import Direction from '@/Utils/Direction';

export default class Snake {

    protected _headX: number;
    protected _headY: number;
    protected _length: number;
    protected _direction: Direction;
    protected _body: Coord[] = [];

    constructor(length: number = 8, x: number = 2, y: number = 2, direction: Direction = new Direction) {
        this._direction = direction;
        this._headX = x;
        this._headY = y;
        this._length = length;
        this.makeBody();
    }

    private makeBody(): void {
        for (let i = this._length - 1; i >= 0; i--) {
            const x = this._headX + i * this._direction.x;
            const y = this._headY + i * this._direction.y;
            this._body.push(new Coord(x, y));
        }
    }

    public draw(): void {
    }

    public get headX(): number {
        return this._headX;
    }

    public get headY(): number {
        return this._headY;
    }

    public get length(): number {
        return this._length;
    }

    public get direction(): Direction {
        return this._direction;
    }

}
