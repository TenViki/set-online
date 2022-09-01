import { User } from "src/user/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GoogleLogin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  googleId: string;

  @OneToOne(() => User, (user) => user.discordLogin, { nullable: true })
  user?: User;

  @Column({ unique: true })
  accessToken: string;

  @Column({ unique: true })
  refreshToken: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  expiresAt: Date;
}
