import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = environment.apiUrl + '/requests';

  constructor(private http: HttpClient) {}

  // 🔐 Attach JWT token if available
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('shift-app-token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // 🧾 Submit a new shift request (employee)
  submitRequest(data: any): Observable<any> {
    const userId = Number(localStorage.getItem('shift-app-userId'));
    const payload = {
      userId,
      requestedDates: data.requestedDates, // expects ['2025-10-20', '2025-10-21', ...]
      shift: data.shift
    };

    console.log('Submitting shift request:', payload);

    return this.http.post(`${this.apiUrl}`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  // 👤 Fetch requests for the logged-in employee
  getRequestsByUser(): Observable<any> {
    const userId = Number(localStorage.getItem('shift-app-userId'));
    const params = new HttpParams().set('userId', String(userId));

    return this.http.get(`${this.apiUrl}/user`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  // 🧑‍💼 Admin: Get all requests (paginated + optional status filter)
  getAllRequests(page = 0, size = 10, status?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (status) params = params.set('status', status);

    return this.http.get(`${this.apiUrl}/admin`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  // ✅ Admin: Approve a request
  approveRequest(requestId: number, adminComment?: string): Observable<any> {
    const payload = { adminComment }; // backend expects { adminComment }
    return this.http.put(
      `${this.apiUrl}/${requestId}/approve`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }

  // ❌ Admin: Reject a request
  rejectRequest(requestId: number, adminComment?: string): Observable<any> {
    const payload = { adminComment };
    return this.http.put(
      `${this.apiUrl}/${requestId}/reject`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }
}
