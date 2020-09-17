export interface JWTUserPayloadInterface {
  _id: string;
  name: string;
}

export interface JWTInterface extends JWTUserPayloadInterface {
  iat: number;
  exp: number;
}
