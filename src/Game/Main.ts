import Coord from '@/Utils/Coord';
import Direction from '@/Utils/Direction';

import Apple from './Apple';

export class Main {
    
    protected canvasId: string = '';
    protected gridCount: number = 10;
    protected canvasContext: CanvasRenderingContext2D;
    protected canvas: HTMLCanvasElement;
    protected cellWidth: number = 5;
    protected cellHeight: number = 5;

    protected snakeX: number = 2;
    protected snakeY: number = 4;
    protected snakeLength: number = 8;
    protected snakeDirection: Direction;
    protected snake: Coord[] = [];
    protected apple: Apple = new Apple(new Coord(0,0), new Coord(1,1)); // placeholder

    protected isPaused = false;

    constructor(canvasId: string, gridCount: number = 10) {
        this.canvasId = canvasId;
        this.gridCount = gridCount;
        this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.cellWidth = Math.floor(this.canvas.width / this.gridCount);
        this.cellHeight = Math.floor(this.canvas.height / this.gridCount);
        this.snakeDirection = new Direction;
        this.snakeDirection.setUp();
    }

    public start(): void {
        this.makeSnake();
        // this.createField();
        this.createApple();
        setInterval(() => {
            if (!this.isPaused) {
                this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.moveSnake();
                this.renderApple();
                this.renderSnake();
                this.canvasContext.stroke();
            }
        }, 1000 / 640);
    }

    private restart(): void {
        this.snake = [];
        this.snakeX = 2;
        this.snakeY = 4;
        this.snakeLength = 8;
        this.snakeDirection.setUp();
        this.makeSnake();
    }

    private createApple(): void {
        const appleScale = 20;
        const appleX1 = Math.floor(Math.random() * (this.gridCount - appleScale));
        const appleY1 = Math.floor(Math.random() * (this.gridCount - appleScale));
        this.apple = new Apple(new Coord(appleX1, appleY1), new Coord(appleX1 + appleScale, appleY1 + appleScale));
    }

    private renderApple(): void {
        this.canvasContext.fillStyle = 'red';
        this.canvasContext.fillRect(
            this.apple.x1,
            this.apple.y1,
            this.apple.x2 - this.apple.x1,
            this.apple.y2 - this.apple.y1
        );
    }

    private createField(): void {
        this.canvasContext.beginPath();
        this.canvasContext.lineWidth = 1;
        this.canvasContext.strokeStyle = 'grey';
        for (let i = 0; i < this.gridCount; i++) {
            for (let j = 0; j < this.gridCount; j++) {
                this.canvasContext.rect(
                    this.cellHeight * i,
                    this.cellWidth * j,
                    this.cellWidth,
                    this.cellHeight
                );
            }
        }
    }

    private moveSnake(): void {
        this.snake.pop();
        let newX = this.snake[0].x + this.snakeDirection.x;
        let newY = this.snake[0].y + this.snakeDirection.y;
        if (newX > this.gridCount -1) newX = 0;
        if (newY > this.gridCount -1) newY = 0;
        if (newX < 0) newX = this.gridCount - 1;
        if (newY < 0) newY = this.gridCount - 1;
        this.snake.unshift(new Coord(newX, newY));
        for (let i = 1; i < this.snakeLength; i++) {
            if (newX === this.snake[i].x && newY === this.snake[i].y) {
                this.restart();
                alert('collision');
            } else if (
                newX >= this.apple.x1
                && newX <= this.apple.x2
                && newY >= this.apple.y1
                && newY <= this.apple.y2
            ) {
                this.snakeLength += 20;
                for (let i = 0; i < 20; i++) {
                    const x = this.snakeX + i * this.snakeDirection.x * -1;
                    const y = this.snakeY + i * this.snakeDirection.y * -1;
                    this.snake.push(new Coord(x, y));
                }
                this.createApple();
            }
        }
    }

    private render(): void {
    }

    private makeSnake(): void {
        for (let i = this.snakeLength - 1; i >= 0; i--) {
            const x = this.snakeX + i * this.snakeDirection.x;
            const y = this.snakeY + i * this.snakeDirection.y;
            this.snake.push(new Coord(x, y));
        }
        // console.log('head', this.snake[0]);
        // console.log('tail', this.snake[this.snake.length - 1]);
    }

    private renderSnake(): void {
        this.canvasContext.fillStyle = 'green';
        for (let i = 0; i < this.snake.length; i++) {
            // let x = this.snake[i].x % this.gridCount;
            // let y = this.snake[i].y % this.gridCount;
            let x= this.snake[i].x;
            let y= this.snake[i].y;
            if (x > this.gridCount - 1) x -= this.gridCount - 1
            if (y > this.gridCount - 1) y -= this.gridCount - 1
            if (x < 0) x = this.gridCount + x;
            if (y < 0) y = this.gridCount + y;
            this.canvasContext.fillRect(
                x * this.cellWidth,
                y * this.cellWidth,
                this.cellWidth,
                this.cellHeight
            );
        }
    }

    public dirLeft(): void {
        if (!this.snakeDirection.isRight()) this.snakeDirection.setLeft();
    }

    public dirRight(): void {
        if (!this.snakeDirection.isLeft()) this.snakeDirection.setRight();
    }

    public dirUp(): void {
        if (!this.snakeDirection.isDown()) this.snakeDirection.setUp();
    }

    public dirDown(): void {
        if (!this.snakeDirection.isUp()) this.snakeDirection.setDown();
    }

    public togglePause(): void {
        this.isPaused = !this.isPaused;
    }


}
