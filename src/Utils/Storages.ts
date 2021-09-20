import PathNode from './PathNode';
import Coord from './Coord';

class _Storage<T> {
    protected storage: T[][] = [];

    public has(x: number, y: number): boolean {
        if (this.storage[x][y]) return true;
        return false;
    }

    public get(x: number, y: number): T {
        return this.storage[x][y];
    }

}

export class CoordStorage extends _Storage<Coord> {

    constructor(xBound: number, yBound: number) {
        super();
        for (let i = 0; i < xBound; ++i) {
            this.storage.push([]);
            for (let j = 0; j < yBound; ++j) {
                this.storage[i].push(new Coord(i, j));
            }
        }
    }

    public add(c: Coord): void {
        this.storage[c.x][c.y] = c;
    }

}

export class NodeStorage extends _Storage<PathNode> {

    constructor(xBound: number, yBound: number) {
        super();
        for (let i = 0; i < xBound; ++i) {
            this.storage.push([]);
            for (let j = 0; j < yBound; ++j) {
                this.storage[i].push(new PathNode(i, j));
            }
        }
    }

    public add(c: PathNode): void {
        this.storage[c.x][c.y] = c;
    }

}

export class IndiciesStorage {

    private store: boolean[][] = [];
    private xLen: number;
    private yLen: number;

    constructor(xBounds: number, yBounds: number) {
        this.xLen = xBounds;
        this.yLen = yBounds;
        for (let i = 0; i < xBounds; ++i) {
            this.store.push([]);
            for (let j = 0; j < yBounds; ++j) {
                this.store[i][j] = false;
            }
        }
    }

    public add(x: number, y: number): void {
        this.store[x][y] = true;
    }

    public has(x: number, y: number): boolean {
        return this.store[x][y];
    }

    public remove(x: number, y: number): void {
        this.store[x][y] = false;
    }

    public clean(): void {
        for (let i = 0; i < this.xLen; ++i) {
            for (let j = 0; j < this.yLen; ++j) {
                this.store[i][j] = false;
            }
        }
    }

}
