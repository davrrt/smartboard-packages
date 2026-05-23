import { Injectable } from "@nestjs/common";

@Injectable()
export class NotesService {
  list() {
    return [{ id: "1", name: "Exemple notes" }];
  }
}
