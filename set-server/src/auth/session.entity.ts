import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column()
  loginType: string;

  @Column()
  userAgent: string;

  @Column()
  ip: string;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
  })
  lastUsed: Date;

  @Column({
    nullable: true,
  })
  expiresAt: Date;
}
