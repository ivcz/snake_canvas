import Coord from '@/Utils/Coord';

import Apple from './Apple';
import Field from './Field';
import Snake from './Snake';

export class Main {
    
    protected field: Field;
    protected snake: Snake;
    protected apple: Apple;

    protected isPaused = false;
    protected appleScale: number = 20;
    protected turnRate: number = 1000 / 640;

    constructor(canvasId: string, gridCount: number = 10) {
        this.field = new Field(canvasId, gridCount);
        this.snake = new Snake();
        this.apple = new Apple(new Coord(0, 0), new Coord(1, 1));
    }

    public start(): void {
        this.createApple();
        setInterval(() => {
            if (!this.isPaused) {
                this.field.clear();
                this.snake.draw(this.field);
                this.apple.draw(this.field);
                this.field.render();
                const moveResponse = this.snake.move(this.field, this.apple, this.appleScale);
                if (moveResponse === 'collision') {
                    alert('collision');
                    this.isPaused = true;
                    this.restart();
                } else if (moveResponse === 'apple') {
                    this.createApple();
                }
            }
        }, this.turnRate);
    }

    private restart(): void {
        this.snake = new Snake();
        this.apple = new Apple(new Coord(0, 0), new Coord(1, 1));
    }

    private createApple(): void {
        const appleX1 = Math.floor(Math.random() * (this.field.gridCount - this.appleScale));
        const appleY1 = Math.floor(Math.random() * (this.field.gridCount - this.appleScale));
        this.apple = new Apple(
            new Coord(appleX1, appleY1),
            new Coord(appleX1 + this.appleScale, appleY1 + this.appleScale)
        );
    }

    private render(): void {
    }

    public dirLeft(): void {
        if (!this.snake.direction.isRight()) this.snake.direction.setLeft();
    }

    public dirRight(): void {
        if (!this.snake.direction.isLeft()) this.snake.direction.setRight();
    }

    public dirUp(): void {
        if (!this.snake.direction.isDown()) this.snake.direction.setUp();
    }

    public dirDown(): void {
        if (!this.snake.direction.isUp()) this.snake.direction.setDown();
    }

    public togglePause(): void {
        this.isPaused = !this.isPaused;
    }


}
