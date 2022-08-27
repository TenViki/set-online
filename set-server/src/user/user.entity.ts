import { PasswordLogin } from "src/auth/login/passwordLogin.entity";
import { Session } from "src/auth/session.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @OneToMany(() => Session, (session) => session.user, {
    onDelete: "CASCADE",
  })
  sessions: Session[];

  @OneToOne(() => PasswordLogin, (passwordLogin) => passwordLogin.user, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  passwordLogin: PasswordLogin;
}
