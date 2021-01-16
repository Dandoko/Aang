// point; a body part
export default class PoseComponent {
  constructor(x = 0, y = 0, part = "", score = 0) {
    this.position = {
      x,
      y,
    };
    this.part = part;
    this.score = score;
  }
}
