import { Injectable } from "@nestjs/common";

export interface DemoItem {
  id: string;
  name: string;
}

@Injectable()
export class DemoService {
  private readonly items: DemoItem[] = [
    { id: "1", name: "Premier item" },
    { id: "2", name: "Deuxième item" },
  ];

  list(): DemoItem[] {
    return this.items;
  }
}
