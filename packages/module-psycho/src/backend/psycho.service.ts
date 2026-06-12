import { Injectable } from "@nestjs/common";

@Injectable()
export class PsychoService {
  list() {
    return [{ id: "1", name: "Exemple psycho" }];
  }
}
