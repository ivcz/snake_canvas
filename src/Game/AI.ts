import { Main as Game } from './Main';

import Coord from '@/Utils/Coord';
import Direction from '@/Utils/Direction';

export default class AI {

    protected game: Game;
    // protected turnRate: number = 1000 / 640;
    protected turnRate: number;
    protected lookAhead: number = 1;
    protected lookDirection: Direction;
    protected direction: Direction;

    protected rotationFlag: boolean = true;

    constructor(game: Game) {
        this.game = game;
        this.turnRate = this.game.tr;
        this.lookDirection = this.game.snake.direction;
        this.direction = this.lookDirection;
    }

    private look(): void {
        if (!this.collisionAhead()) return;
        this.rotationFlag ? this.direction.rotateCW() : this.direction.rotateCCW();
        if (!this.collisionAhead()) return;
        this.rotationFlag ? this.direction.rotateCCW() : this.direction.rotateCW();
        this.rotationFlag ? this.direction.rotateCCW() : this.direction.rotateCW();
        if (!this.collisionAhead()) return;
        this.rotationFlag ? this.direction.rotateCCW() : this.direction.rotateCW();
        // this.game.snake.direction.setVector(this.direction.getDirection());
        this.rotationFlag = !this.rotationFlag;

        // this.look();
        // this.act();
    }

    private getDirectionToApple(): void {
        let appleXCenter = Math.ceil((this.game.apple.x2 + this.game.apple.x1) / 2);
        let appleYCenter = Math.ceil((this.game.apple.y2 + this.game.apple.y1) / 2);
        const xDiff = this.game.snake.headX - appleXCenter;
        const yDiff = this.game.snake.headY - appleYCenter;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff < 0) {
                if (!this.direction.isLeft()) {
                    this.direction.setRight();
                    return;
                }
            } else {
                if (!this.direction.isRight()){
                    this.direction.setLeft();
                    return;
                }
            }
            if (yDiff > 0) {
                this.direction.setDown();
            } else {
                this.direction.setUp();
            }
        } else if (Math.abs(xDiff) < Math.abs(yDiff)) {
            if (yDiff > 0) {
                if (!this.direction.isDown()) {
                    this.direction.setUp();
                    return;
                }
            } else {
                if (!this.direction.isUp()) {
                    this.direction.setDown();
                    return;
                }
            }
            if (xDiff < 0) {
                this.direction.setRight();
            } else  {
                this.direction.setLeft();
            }
        }
    }

    private collisionAhead(): boolean {
        let ahead: Coord[] = [];
        for (let i = 1; i <= this.lookAhead; i++) {
            let newX = this.game.snake.headX + this.direction.x * i;
            let newY = this.game.snake.headY + this.direction.y * i;
            if (newX > this.game.field.gridCount -1) newX = 0;
            if (newY > this.game.field.gridCount -1) newY = 0;
            if (newX < 0) newX = this.game.field.gridCount - 1;
            if (newY < 0) newY = this.game.field.gridCount - 1;
            ahead.push(
                new Coord(
                    newX, newY
                )
            );
        }
        for (let i = 1; i < this.game.snake.length - 1; i++) {
            for (let j = 0; j < this.lookAhead; j++) {
                if (
                    this.game.snake.body[i].x === ahead[j].x
                    && this.game.snake.body[i].y === ahead[j].y
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    private act(): void {
        this.getDirectionToApple();
        this.look();
        this.game.snake.direction.setVector(this.direction.getDirection());
    }

    public start(): void {
        // setInterval(() => {
            if (!this.game.pause) {
                this.act();
            }
        // }, this.turnRate / 10);
    }

}
