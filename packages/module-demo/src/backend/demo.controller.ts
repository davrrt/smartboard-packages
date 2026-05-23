import { Controller, Get } from "@nestjs/common";
import { RequirePermissions } from "@smartboard/contracts";
import { DemoService } from "./demo.service";

@Controller("demo")
export class DemoController {
  constructor(private readonly demo: DemoService) {}

  @Get("items")
  @RequirePermissions("demo.read")
  list() {
    return this.demo.list();
  }
}
