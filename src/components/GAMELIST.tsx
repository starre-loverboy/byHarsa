class Game {
  id: number;
  path: string;
  img: string;

  constructor(id: number, path: string, img: string) {
    this.id = id;
    this.path = path;
    this.img = img;
  }
}

const GAMELIST: Game[] = [
  new Game(
    1,
    "/reactionSpeed",
    "rt-logo.jpeg"
  ),
  new Game(
    2,
    "/memoryCard",
    "mc-logo.jpeg"
  ),
  new Game(
    3, 
    "/aimTrainer",
    "at-logo.jpeg"
  ),
    new Game(
    4, 
    "/stroop",
    "s-logo.jpeg"
  ),
    new Game(
    5, 
    "/programmerClicker",
    "pc-logo.jpeg"
  ),
];

export default GAMELIST;
