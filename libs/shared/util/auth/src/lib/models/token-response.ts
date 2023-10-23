export interface TokenDetail {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
  refresh_token: string;
}

export interface TokenResponse {
  return_data: {
    tokens: TokenDetail;
    requested_url: string;
  };
}

export interface RefreshTokenResponse {
  return_code: string;
  return_data: TokenDetail;
}
