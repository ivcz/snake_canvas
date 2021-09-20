import Coord from '@/Utils/Coord';

import Apple from './Apple';
import Field from './Field';
import Snake from './Snake';

export class Main {
    
    protected _field: Field;
    protected _snake: Snake;
    protected _apple: Apple;

    protected isPaused = false;
    protected appleScale: number = 1;
    protected turnRate: number = 1000 / 640;

    constructor(canvasId: string, gridCount: number = 10) {
        this._field = new Field(canvasId, gridCount);
        this._snake = new Snake();
        this._apple = new Apple(new Coord(0, 0), new Coord(1, 1));
        this.createApple();
    }

    public start(): void {
        // setInterval(() => {
            if (!this.isPaused) {
                switch (this._snake.move(this._field, this._apple, this.appleScale)) {
                    case 'collision':
                        console.log('score: ', this._snake.length);
                        alert('collision');
                        this.isPaused = true;
                        this.restart();
                    break;

                    case 'apple':
                        this.createApple();
                    break;
                }
                this._field.clear();
                this._snake.draw(this._field);
                this._apple.draw(this._field);
                this._field.render();
            }
        // }, this.turnRate);
    }

    private restart(): void {
        this._snake = new Snake();
        this.createApple();
    }

    private createApple(): void {
        const appleX1 = Math.ceil(Math.random() * (this._field.gridCount - this.appleScale));
        const appleY1 = Math.ceil(Math.random() * (this._field.gridCount - this.appleScale));
        const appleX2 = this.appleScale === 1 ? appleX1 : this.appleScale + appleX1;
        const appleY2 = this.appleScale === 1 ? appleY1 : this.appleScale + appleY1;
        for (let i = appleX1; i <= appleX2; ++i) {
            for (let j = appleY1; j <= appleY2; ++j) {
                if (this.snake.has(i,j)) {
                    this.createApple();
                    return;
                }
            }
        }
        // this._apple = new Apple(
        //     new Coord(appleX1, appleY1),
        //     new Coord(appleX1, appleY1)
        // );
        this._apple = new Apple(
            new Coord(appleX1, appleY1),
            new Coord(appleX2, appleY2)
        );
    }

    private render(): void {
    }

    public dirLeft(): void {
        if (!this._snake.direction.isRight()) this._snake.direction.setLeft();
    }

    public dirRight(): void {
        if (!this._snake.direction.isLeft()) this._snake.direction.setRight();
    }

    public dirUp(): void {
        if (!this._snake.direction.isDown()) this._snake.direction.setUp();
    }

    public dirDown(): void {
        if (!this._snake.direction.isUp()) this._snake.direction.setDown();
    }

    public togglePause(): void {
        this.isPaused = !this.isPaused;
    }

    public get apple(): Apple {
        return this._apple;
    }

    public get field(): Field {
        return this._field;
    }

    public get snake(): Snake {
        return this._snake;
    }

    public get pause(): boolean {
        return this.isPaused;
    }

    public get tr(): number {
        return this.turnRate;
    }

}
