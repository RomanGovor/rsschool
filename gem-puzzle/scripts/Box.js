// eslint-disable-next-line no-unused-vars
class Box {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    getTopBox() {
        if (this.y === 0) return null;
        return new Box(this.x, this.y - 1, this.size);
    }

    getRightBox() {
        if (this.x === this.size - 1) return null;
        return new Box(this.x + 1, this.y, this.size);
    }

    getBottomBox() {
        if (this.y === this.size - 1) return null;
        return new Box(this.x, this.y + 1, this.size);
    }

    getLeftBox() {
        if (this.x === 0) return null;
        return new Box(this.x - 1, this.y, this.size);
    }

    getNextdoorBoxes() {
        return [
            this.getTopBox(),
            this.getRightBox(),
            this.getBottomBox(),
            this.getLeftBox()
        ].filter(box => box !== null);
    }

    getRandomNextdoorBox() {
        const nextdoorBoxes = this.getNextdoorBoxes();
        return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)];
    }

    static swapBoxes(grid, box1, box2){
        const temp = grid[box1.y][box1.x];
        grid[box1.y][box1.x] = grid[box2.y][box2.x];
        grid[box2.y][box2.x] = temp;
    }
}