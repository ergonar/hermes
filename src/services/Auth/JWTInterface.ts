export interface JWTUserPayloadInterface {
  id: string;
  name: string;
}

export interface JWTInterface extends JWTUserPayloadInterface {
  iat: number;
  exp: number;
}
