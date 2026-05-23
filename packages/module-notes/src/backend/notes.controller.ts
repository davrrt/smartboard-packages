import { Controller, Get } from "@nestjs/common";
import { RequirePermissions } from "@smartboard/contracts";
import { NotesService } from "./notes.service";

@Controller("notes")
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Get()
  @RequirePermissions("notes.read")
  list() {
    return this.service.list();
  }
}
