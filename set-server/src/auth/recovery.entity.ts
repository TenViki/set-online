import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recovery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  @Column()
  token: string;

  @Column()
  selector: string;

  @Column()
  expiresAt: Date;
}
