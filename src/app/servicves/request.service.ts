import { Injectable } from '@angular/core';
import { EmployeeRequest } from '../models/models';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

 private apiUrl = 'http://localhost:8080/api/requests';

  constructor(private http: HttpClient) {}

  // 🔐 Helper: attach JWT token from localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // 🧾 Submit new shift request (employee)
submitRequest(data: any): Observable<any> {
  const userId = Number(localStorage.getItem('shift-app-userId'));
  return this.http.post(`${this.apiUrl}/requests`, { ...data, userId }, { headers: this.getAuthHeaders() });
}

  // 👤 Get requests for the logged-in user
getRequestsByUser(): Observable<any> {
  const userId = Number(localStorage.getItem('shift-app-userId'));
  return this.http.get(`${this.apiUrl}/requests/user`, {
    headers: this.getAuthHeaders(),
    params: new HttpParams().set('userId', String(userId)),
  });
}

  // 🧑‍💼 Admin: Get all requests with pagination & filtering
  getAllRequests(page = 0, size = 10, status?: string): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);

    return this.http.get(`${this.apiUrl}/admin`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  // ✅ Admin: Approve request
  approveRequest(requestId: number, comment?: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${requestId}/approve`,
      { comment },
      { headers: this.getAuthHeaders() }
    );
  }

  // ❌ Admin: Reject request
  rejectRequest(requestId: number, comment?: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${requestId}/reject`,
      { comment },
      { headers: this.getAuthHeaders() }
    );
  }
}

