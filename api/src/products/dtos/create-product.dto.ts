type Attribute = {
  name: string;
  value: string;
};

export class CreateProductDto {
  name: string;
  purchasePrice: number;
  purchaseDate: Date;
  category: number;
  attributes: Attribute[];
}
