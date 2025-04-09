export interface Artist {
  id: number;
  name: string;
  bornCity: string;
  birthdate: string;
  img: string | null;
  rating: number;
  songs: number[];
}
