import { Session } from "src/auth/session.entity";
import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
