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
