import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column()
  loginType: string;

  @Column()
  userAgent: string;

  @Column()
  ip: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  expiresAt: Date;
}
