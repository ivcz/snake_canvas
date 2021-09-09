import Coord from '@/Utils/Coord';
import Direction from '@/Utils/Direction';

import Apple from './Apple';
import Field from './Field';

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

    public draw(field: Field): void {
        field.context.fillStyle = 'green';
        for (let i = 0; i < this._length; i++) {
            let x= this._body[i].x;
            let y= this._body[i].y;
            if (x > field.gridCount - 1) x -= field.gridCount - 1
            if (y > field.gridCount - 1) y -= field.gridCount - 1
            if (x < 0) x = field.gridCount + x;
            if (y < 0) y = field.gridCount + y;
            field.context.fillRect(
                x * field.cellWidth,
                y * field.cellWidth,
                field.cellWidth,
                field.cellHeight
            );
        }
    }

    public move(field: Field, apple?: Apple, incrementOnApple: number = 20): string | null {
        this._body.pop();
        let newX = this._body[0].x + this._direction.x;
        let newY = this._body[0].y + this._direction.y;
        if (newX > field.gridCount -1) newX = 0;
        if (newY > field.gridCount -1) newY = 0;
        if (newX < 0) newX = field.gridCount - 1;
        if (newY < 0) newY = field.gridCount - 1;

        if (this.checkCollison(newX, newY)) {
            return 'collision';
        }
        this._body.unshift(new Coord(newX, newY));

        if (apple && this.checkAppleCollision(apple, newX, newY)) {
            const tail = this._body[this.length - 1];
            const tailXVector = tail.x - this._body[this._length - 2].x;
            const tailYVector = tail.y - this._body[this._length - 2].y;
            this._length += incrementOnApple;
            for (let i = 0; i < incrementOnApple; i++) {
                const x = tail.x + i * tailXVector;
                const y = tail.y + i * tailYVector;
                this._body.push(new Coord(x, y));
            }
            return 'apple';
        }
        return null;
    }

    private checkCollison(x: number, y: number): boolean {
        for (let i = 1; i < this._length - 1; ++i) {
            if (x === this._body[i].x && y === this._body[i].y) return true;
        }
        return false;
    }

    private checkAppleCollision(apple: Apple, x: number, y: number): boolean {
        return (
            x >= apple.x1
            && x <= apple.x2
            && y >= apple.y1
            && y <= apple.y2
        );
    }

    public get headX(): number {
        return this._body[0].x;
    }

    public get headY(): number {
        return this._body[0].y;
    }

    public get length(): number {
        return this._length;
    }

    public get direction(): Direction {
        return this._direction;
    }

}
