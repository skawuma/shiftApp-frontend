import { Component } from '@angular/core';
import { DayOfWeek, Shift } from '../models/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RequestService } from '../servicves/request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeForm {

//   form: FormGroup;
//   days: DayOfWeek[] = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
//   shifts: {value: Shift, label: string}[] = [
//     {value: 'MORNING_7_15', label: '7am - 3pm'},
//     {value: 'AFTERNOON_15_23', label: '3pm - 11pm'},
//     {value: 'NIGHT_23_7', label: '11pm - 7am'}
//   ];
//   message = '';

//   constructor(private fb: FormBuilder, private svc: RequestService) {
//     this.form = this.fb.group({
//       employeeName: [''],
//       requestedDays: [[]],
//       shift: ['MORNING_7_15']
//     });
//   }

//   toggleDay(day: DayOfWeek) {
//     const arr: DayOfWeek[] = this.form.value.requestedDays || [];
//     const idx = arr.indexOf(day);
//     if (idx === -1) arr.push(day); else arr.splice(idx,1);
//     this.form.patchValue({ requestedDays: arr });
//   }

//   submit() {
//     if (!this.form.value.employeeName) {
//       this.message = 'Enter your name.';
//       return;
//     }
//     if ((this.form.value.requestedDays || []).length === 0) {
//       this.message = 'Pick at least one day.';
//       return;
//     }
//     this.svc.submitRequest(this.form.value).subscribe({
//       next: res => {
//         this.message = 'Request submitted — id: ' + res.id;
//         this.form.reset({ employeeName: '', requestedDays: [], shift: 'MORNING_7_15' });
//       },
//       error: err => this.message = 'Error submitting: ' + (err.message || err.statusText)
//     });
//   }


//   onEmployeeNameInput(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   this.form.patchValue({ employeeName: input.value });
// }


//   onShiftChange(event: Event): void {
//   const select = event.target as HTMLSelectElement;
//   this.form.patchValue({ shift: select.value });
// }

}
