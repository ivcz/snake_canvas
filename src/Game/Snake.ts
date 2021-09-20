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
            this._body.push(
                new Coord(
                    this._headX + i * this._direction.x,
                    this._headY + i * this._direction.y
                )
            );
        }
    }

    public draw(field: Field): void {
        field.context.fillStyle = 'green';
        for (const item of this._body) {
            field.context.fillRect(
                item.x * field.cellWidth,
                item.y * field.cellWidth,
                field.cellWidth,
                field.cellHeight
            );
        }
    }

    public move(field: Field, apple?: Apple, incrementOnApple: number = 20): string | null {
        this._body.pop();
        let newX = this.body[0].x + this._direction.x;
        let newY = this.body[0].y + this._direction.y;
        if (newX >= field.gridCount) newX = 0;
        if (newY >= field.gridCount) newY = 0;
        if (newX < 0) newX = field.gridCount - 1;
        if (newY < 0) newY = field.gridCount - 1;

        if (this.has(newX, newY)) {
            return 'collision';
        }
        this._body.unshift(new Coord(newX, newY));

        if (apple && this.checkAppleCollision(apple, newX, newY)) {
            const tail = this.body[this._length - 1];
            const tailXVector = tail.x - this.body[this._length - 2].x;
            const tailYVector = tail.y - this.body[this._length - 2].y;
            this._length += incrementOnApple;
            for (let i = 0; i < incrementOnApple; i++) {
                this._body.push(
                    new Coord(
                        tail.x + i * tailXVector,
                        tail.y + i * tailYVector
                    )
                );
            }
            return 'apple';
        }
        return null;
    }

    public has(x: number, y: number): boolean {
        for (const part of this._body) {
            if (part.x === x && part.y === y) return true;
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

    public get body(): Coord[] {
        return this._body;
    }

    public get direction(): Direction {
        return this._direction;
    }

}
