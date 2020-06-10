export default class Gate{
    constructor(user){
        this.user = user;
    }

    isAdmin(){
        return this.user.type === 'admin';
    }
    isUser(){
        return this.user.type === 'user';
    }
    isAdminorAuthor(){
        if(this.user.type === 'admin' || this.user.type === 'author'){
            return true;
        }
        
    }
    isUserorAuthor(){
        if(this.user.type === 'user' || this.user.type === 'author'){
            return true;
        }
        
    }
}