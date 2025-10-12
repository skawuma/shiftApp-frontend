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
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  
}
