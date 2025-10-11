import { Injectable } from '@angular/core';
import { EmployeeRequest } from '../models/models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private base = 'http://localhost:8080/api/requests';
  constructor(private http: HttpClient) {}

  submitRequest(req: EmployeeRequest): Observable<EmployeeRequest> {
    return this.http.post<EmployeeRequest>(this.base, req);
  }

  getAll(): Observable<EmployeeRequest[]> {
    return this.http.get<EmployeeRequest[]>(this.base);
  }

  updateStatus(id: number, status: 'APPROVED'|'REJECTED', adminComment?: string) {
    return this.http.put<EmployeeRequest>(`${this.base}/${id}/status`, { status, adminComment });
  }
  
}
