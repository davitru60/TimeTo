import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterestDeleteResponse, UserInterestGetResponse, UserInterestPostData, UserInterestPostResponse} from '../../../core/interfaces/user-preferences';
import { userRoutes } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInterests(): Observable<UserInterestGetResponse>{
    return this.http.get<UserInterestGetResponse>(userRoutes.getUserInterests,{params:{auth:'true'}})
  }

  addUserInterest(userInterest:UserInterestPostData): Observable<UserInterestPostResponse>{
    return this.http.post<UserInterestPostResponse>(userRoutes.addUserInterest,userInterest,{params:{auth:'true'}})
  }

  deleteUserInterest(userIntId:number): Observable<UserInterestDeleteResponse>{
    return this.http.delete<UserInterestDeleteResponse>(userRoutes.deleteUserInterest(userIntId),{params:{auth:'true'}})
  }
}
