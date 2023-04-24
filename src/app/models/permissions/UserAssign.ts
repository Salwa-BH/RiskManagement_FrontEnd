export class UserAssign{
    public id: number;
    public user_id: number;
    public role_id: number;
    public profile_id: number;
    public group_id: number;

    constructor(user,role,profile,group){
        this.user_id = user;
        this.role_id = role;
        this.profile_id = profile;
        this.group_id = group;
    }
}