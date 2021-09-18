import { Main as Game } from './Main';
import AStar from './AStar';

import Coord from '@/Utils/Coord';
import Direction from '@/Utils/Direction';

export default class AI {

    protected game: Game;
    // protected turnRate: number = 1000 / 640;
    protected turnRate: number;
    protected astar: AStar;

    private direction: Direction = new Direction;

    constructor(game: Game) {
        this.game = game;
        this.turnRate = this.game.tr;
        this.astar = new AStar(this.game);
    }

    private getVector(c1: Coord, c2: Coord) {
        return [c2.x - c1.x, c2.y - c1.y];
    }

    private look(): void {
        if (!this.collisionAhead()) return;
        for (let i = 0; i <= 4; ++i) {
            this.direction.rotateCW();
            if (!this.collisionAhead()) return;
        }
    }

    private collisionAhead(): boolean {
        let newX = this.direction.x + this.game.snake.headX;
        let newY = this.direction.y + this.game.snake.headY;
        if (newX < 0) return true;
        if (newY < 0) return true;
        if (newX >= this.game.field.gridCount) return true;
        if (newY >= this.game.field.gridCount) return true;
        return this.game.snake.has(`${newX}.${newY}`);
    }

    private act(): void {
        try {
            const nextCoord = this.astar.nextCoord();
            const newVector = this.getVector(new Coord(this.game.snake.headX, this.game.snake.headY), nextCoord);
            this.game.snake.direction.setVector(newVector);
        } catch (err) {
            this.direction = this.game.snake.direction;
            this.look();
            this.game.snake.direction.setVector(this.direction.getDirection());
        }
    }

    public start(): void {
        this.astar = new AStar(this.game);
        this.act();
    }

}
