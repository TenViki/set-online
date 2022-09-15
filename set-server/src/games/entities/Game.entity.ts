import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum GameStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  code: string;

  @Column()
  status: string;

  @ManyToOne(() => User, { nullable: true })
  winner: User;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @OneToMany(() => User, (user) => user.game)
  players: User[];

  @OneToOne(() => User, (user) => user.hosting)
  host: User;

  @Column()
  limit: number;

  @Column()
  public: boolean;

  @Column({ nullable: true })
  deck: string;

  @Column({ nullable: true })
  laidOut: string;
}
