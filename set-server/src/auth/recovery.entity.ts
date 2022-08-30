import { User } from "src/user/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recovery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column()
  token: string;

  @Column()
  selector: string;

  @Column()
  expiresAt: Date;
}
