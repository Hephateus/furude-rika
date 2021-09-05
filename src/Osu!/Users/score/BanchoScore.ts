import { Score } from 'node-osu';
import AbstractScore from './AbstractScore';

class BanchoScore extends AbstractScore {
  public constructor(score: Score) {
    super();
    Object.assign(this, score);
  }
}

export default BanchoScore;