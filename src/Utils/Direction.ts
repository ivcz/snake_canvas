export default class Direction {

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

    public setLeft(): this {
        [...this.directionVector] = [-1, 0];
        return this;
    }

    public setRight(): this {
        [...this.directionVector] = [1, 0];
        return this;
    }

    public setUp(): this {
        [...this.directionVector] = [0, -1];
        return this;
    }

    public setDown(): this {
        [...this.directionVector] = [0, 1];
        return this;
    }

    public getDirection(): Array<number> {
        return this.directionVector;
    }

    public setVector(vector: number[]): void {
        const [x, y] = vector;
        if (x > 1 || x < -1 || y > 1 || y < -1) throw 'wrong vector';
        this.directionVector = vector;
    }

    public get x(): number {
        return this.directionVector[0];
    }

    public get y(): number {
        return this.directionVector[1];
    }

    public rotateCW(): void {
        if (this.isUp()) {
            this.setRight();
        } else if (this.isRight()) {
            this.setDown();
        } else if (this.isDown()) {
            this.setLeft();
        } else {
            this.setUp();
        }
    }

    public rotateCCW(): void {
        if (this.isUp()) {
            this.setLeft();
        } else if (this.isLeft()) {
            this.setDown();
        } else if (this.isDown()) {
            this.setRight();
        } else {
            this.setUp();
        }
    }

}
