import Coord from '@/Utils/Coord';
import Direction from '@/Utils/Direction';
import { IndiciesStorage } from '@/Utils/Storages';

import Apple from './Apple';
import Field from './Field';

export default class Snake {

    protected _headX: number;
    protected _headY: number;
    protected _length: number;
    protected _direction: Direction;
    protected _body: Coord[] = [];

    private indicies: IndiciesStorage;
    private field: Field;

    constructor(field: Field, length: number = 8, x: number = 2, y: number = 2, direction: Direction = new Direction) {
        this._direction = direction;
        this._headX = x;
        this._headY = y;
        this._length = length;
        this.field = field;
        this.indicies = new IndiciesStorage(this.field.gridCount, this.field.gridCount);
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
            this.indicies.add(
                this._headX + i * this._direction.x,
                this._headY + i * this._direction.y
            );
        }
    }

    public draw(): void {
        this.field.context.fillStyle = 'green';
        for (const item of this._body) {
            this.field.context.fillRect(
                item.x * this.field.cellWidth,
                item.y * this.field.cellWidth,
                this.field.cellWidth,
                this.field.cellHeight
            );
        }
    }

    public move(apple: Apple, incrementOnApple: number = 20): string | null {
        this.indicies.remove(this._body[this._length - 1].x, this._body[this._length - 1].y);
        this._body.pop();
        let newX = this.body[0].x + this._direction.x;
        let newY = this.body[0].y + this._direction.y;
        if (newX >= this.field.gridCount) newX = 0;
        if (newY >= this.field.gridCount) newY = 0;
        if (newX < 0) newX = this.field.gridCount - 1;
        if (newY < 0) newY = this.field.gridCount - 1;

        if (this.has(newX, newY)) {
            return 'collision';
        }
        this.indicies.add(newX, newY);
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
                this.indicies.add(
                    tail.x + i * tailXVector,
                    tail.y + i * tailYVector
                );
            }
            return 'apple';
        }
        return null;
    }

    public has(x: number, y: number): boolean {
        return this.indicies.has(x, y);
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
