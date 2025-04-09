export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister{
    name:string;
    first_surname:string;
    second_surname:string;
    email: string;
    password: string;

}

export interface LoginResponse{
    success:boolean;
    data:{
        user_id:number;
        name: string;
        token:string;
        roles: string[];
    }
}

export interface ValidationError {
    errors:string
  }

export interface LoginResponseError{
    success:boolean;
    msg: string;
    data?: {}; // Es opcional porque puede que no haya datos en caso de error
    errors?: ValidationError[]
}

export interface RegisterResponse{
    success:boolean;
    data:{
        msg: string;
        roleUserMsg?: string
    }
}

export interface GoogleSignInToken{
    id_token: string;
}