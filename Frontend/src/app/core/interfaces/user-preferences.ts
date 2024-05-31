import { ApiResponse } from "./api-response.interface";

export interface UserInterest {
    user_int_id:number;
    user_id:number;
    category_id:number;
}

export interface UserInterestPostData{
    category_id:number;
}

export interface UserInterestGetResponse{
    success: boolean;
    data:{
        userInterests: UserInterest [];
    }
}

export interface UserInterestPostResponse extends ApiResponse{
    data: UserInterest
}

export interface UserInterestDeleteResponse extends ApiResponse{}