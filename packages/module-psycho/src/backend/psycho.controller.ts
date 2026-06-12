import { Controller, Get } from "@nestjs/common";
import { RequirePermissions } from "@smartboard/contracts";
import { PsychoService } from "./psycho.service";

@Controller("psycho")
export class PsychoController {
  constructor(private readonly service: PsychoService) {}

  @Get()
  @RequirePermissions("psycho.read")
  list() {
    return this.service.list();
  }
}
