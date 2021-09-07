export class Direction {

    private directionVector: Array<number> = [1, 0];

    public isLeft(): boolean {
        return this.x === -1 && this.y === 0;
    }

    public isRight(): boolean {
        return this.x === 1 && this.y === 0;
    }

    public isUp(): boolean {
        return this.x === 0 && this.y === -1;
    }

    public isDown(): boolean {
        return this.x === 0 && this.y === 1;
    }

    public setLeft(): void {
        [...this.directionVector] = [-1, 0];
    }

    public setRight(): void {
        [...this.directionVector] = [1, 0];
    }

    public setUp(): void {
        [...this.directionVector] = [0, -1];
    }

    public setDown(): void {
        [...this.directionVector] = [0, 1];
    }

    public getDirection(): Array<number> {
        return this.directionVector;
    }

    public get x(): number {
        return this.directionVector[0];
    }

    public get y(): number {
        return this.directionVector[1];
    }

}

export class Coord {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }
    
    public get x() : number{
        return this._x;
    }

    public get y() : number{
        return this._y;
    }

}

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

    protected isPaused = false;

    constructor(canvasId: string, gridCount: number = 10) {
        this.canvasId = canvasId;
        this.gridCount = gridCount;
        this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.snakeDirection = new Direction;
        this.snakeDirection.setUp();
    }

    public start(): void {
        this.makeSnake();
        setInterval(() => {
            if (!this.isPaused) {
                this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.createField();
                this.moveSnake();
                this.renderSnake();
                this.canvasContext.stroke();
            }
        }, 1000 / 5);
    }

    private restart(): void {
        this.snake = [];
        this.snakeX = 2;
        this.snakeY = 4;
        this.snakeLength = 8;
        this.snakeDirection.setUp();
        this.makeSnake();
    }

    private createField(): void {
        this.cellWidth = Math.floor(this.canvas.width / this.gridCount);
        this.cellHeight = Math.floor(this.canvas.height / this.gridCount);
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
