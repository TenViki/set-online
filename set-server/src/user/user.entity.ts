import { DiscordLogin } from "src/auth/login/discordLogin/discordLogin.entity";
import { GoogleLogin } from "src/auth/login/googleLogin/googleLogin.entity";
import { PasswordLogin } from "src/auth/login/passwordLogin.entity";
import { Session } from "src/auth/session.entity";
import { Game } from "src/games/entities/Game.entity";
import { Points } from "src/games/entities/Points.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Session, (session) => session.user, {
    onDelete: "CASCADE",
  })
  sessions: Session[];

  @Column({ nullable: true })
  avatar: string | null;

  @JoinColumn()
  @OneToOne(() => PasswordLogin, (passwordLogin) => passwordLogin.user, { onDelete: "SET NULL" })
  passwordLogin: PasswordLogin;

  @JoinColumn()
  @OneToOne(() => DiscordLogin, (discordLogin) => discordLogin.user, { onDelete: "SET NULL" })
  discordLogin: DiscordLogin;

  @JoinColumn()
  @OneToOne(() => GoogleLogin, (googleLogin) => googleLogin.user, { onDelete: "SET NULL" })
  googleLogin: GoogleLogin;

  @ManyToOne(() => Game, (game) => game.players, { onDelete: "SET NULL" })
  game: Game;

  @JoinColumn()
  @OneToOne(() => Game, (game) => game.host, { onDelete: "SET NULL" })
  hosting: Game;

  @OneToMany(() => Points, (points) => points.user)
  points: Points[];
}
