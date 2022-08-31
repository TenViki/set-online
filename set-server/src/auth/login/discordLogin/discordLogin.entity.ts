import { User } from "src/user/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DiscordLogin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.discordLogin, { nullable: true })
  user?: User;

  @Column({ unique: true })
  discordId: string;

  @Column({ unique: true })
  accessToken: string;

  @Column({ unique: true })
  refreshToken: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  expiresAt: Date;
}
