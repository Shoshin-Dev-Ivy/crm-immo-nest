export type JwtTokenType = 'access' | 'refresh'

export interface JwtPayload {
  sub: string
  email: string
  role: string
  type: JwtTokenType
}

export interface DecodedJwtPayload extends JwtPayload {
  iat: number
  exp: number
}