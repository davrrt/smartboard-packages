import { Module } from "@nestjs/common";
import { PsychoController } from "./psycho.controller";
import { PsychoService } from "./psycho.service";

@Module({
  controllers: [PsychoController],
  providers: [PsychoService],
})
export class PsychoBackendModule {}
