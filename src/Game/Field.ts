export default class Field {

    protected _canvas: HTMLCanvasElement;
    protected _context: CanvasRenderingContext2D;
    protected _gridCount: number;
    protected _cellWidth: number;
    protected _cellHeight: number;

    constructor(canvasId: string, gridCount: number = 10) {
        this._canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this._context = this._canvas.getContext('2d') as CanvasRenderingContext2D;
        this._gridCount = gridCount;
        this._cellWidth = Math.floor(this._canvas.width / this._gridCount);
        this._cellHeight = Math.floor(this._canvas.height / this._gridCount);
    }

    public clear(): void {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    public render(): void {
        this._context.stroke();
    }

    public get context(): CanvasRenderingContext2D {
        return this._context;
    }

    public get gridCount(): number {
        return this._gridCount;
    }

    public get cellWidth(): number {
        return this._cellWidth;
    }

    public get cellHeight(): number {
        return this._cellHeight;
    }

}
