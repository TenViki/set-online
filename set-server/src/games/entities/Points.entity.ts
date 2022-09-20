import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./Game.entity";

@Entity()
export class Points {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  points: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Game, (game) => game.points, {
    onDelete: "CASCADE",
  })
  game: Game;
}
