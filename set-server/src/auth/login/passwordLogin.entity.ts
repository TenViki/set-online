import { User } from "src/user/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PasswordLogin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @OneToOne(() => User, (user) => user.passwordLogin, {
    onDelete: "CASCADE",
  })
  user: User;
}
