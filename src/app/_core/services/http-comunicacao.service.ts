import { Injectable } from "@angular/core";
import { SecurityUtil } from "../utils/security.util";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class HttpComunicacaoService {
  
  constructor(
    public securityUtil: SecurityUtil,
    public httpClient: HttpClient
  ) {
  }
}