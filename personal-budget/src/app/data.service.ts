import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BudgetItem {
  title: string;
  budget: number;
}

export interface BudgetResponse {
  myBudget: BudgetItem[];
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000/budget';
  private budgetData: BudgetItem[] = [];
  constructor(private http: HttpClient) {}

  fetchDataFromBackend(): Observable<BudgetResponse> {
    return this.http.get<BudgetResponse>(this.apiUrl);
  }

  getBudgetData(): Observable<BudgetItem[]> {
    if (this.budgetData.length > 0) {
      return of(this.budgetData);
    } else {
      return this.fetchDataFromBackend().pipe(
        map((response: BudgetResponse) => {
          this.budgetData = response.myBudget;
          return this.budgetData;
        })
      );
    }
  }
}
