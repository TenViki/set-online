import { DiscordLogin } from "src/auth/login/discordLogin/discordLogin.entity";
import { GoogleLogin } from "src/auth/login/googleLogin/googleLogin.entity";
import { PasswordLogin } from "src/auth/login/passwordLogin.entity";
import { Session } from "src/auth/session.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @JoinColumn()
  @OneToOne(() => PasswordLogin, (passwordLogin) => passwordLogin.user, { onDelete: "SET NULL" })
  passwordLogin: PasswordLogin;

  @JoinColumn()
  @OneToOne(() => DiscordLogin, (discordLogin) => discordLogin.user, { onDelete: "SET NULL" })
  discordLogin: DiscordLogin;

  @JoinColumn()
  @OneToOne(() => GoogleLogin, (googleLogin) => googleLogin.user, { onDelete: "SET NULL" })
  googleLogin: GoogleLogin;
}
