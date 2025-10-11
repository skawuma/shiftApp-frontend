import { Component, OnInit } from '@angular/core';
import { EmployeeRequest } from '../models/models';
import { RequestService } from '../servicves/request.service';

@Component({
  selector: 'app-admin-list',
  imports: [],
  templateUrl: './admin-list.html',
  styleUrl: './admin-list.css'
})
export class AdminList implements OnInit {
requests: EmployeeRequest[] = [];
  message = '';

  constructor(private svc: RequestService) {}

  ngOnInit() { this.load(); }

  load() {
    this.svc.getAll().subscribe(list => this.requests = list, err => this.message = 'Load error');
  }

  setStatus(r: EmployeeRequest, status: 'APPROVED'|'REJECTED') {
    if (!r.id) return;
    const comment = prompt('Optional admin comment', r.adminComment || '') || '';
    this.svc.updateStatus(r.id, status, comment).subscribe({
      next: updated => {
        this.message = `Request ${updated.id} ${updated.status}`;
        this.load();
      },
      error: e => this.message = 'Update error'
    });
  }
  
}
