import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Recovery } from "./recovery.entity";

@Injectable()
export class RecoveryService {
  constructor(@InjectRepository(Recovery) private recoveryRepo: Repository<Recovery>) {}
}
