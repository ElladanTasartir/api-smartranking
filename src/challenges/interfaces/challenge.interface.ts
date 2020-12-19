import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export interface Challenge extends Document {
  date: Date;
  status: ChallengeStatus;
  requested_at: Date;
  answered_at: Date;
  challenger: string;
  category: string;
  players: Player[];
  match: Match;
}

export interface Match extends Document {
  category: string;
  def: string;
  players: Player[];
  result: Result[];
}

export interface Result {
  set: string;
}
