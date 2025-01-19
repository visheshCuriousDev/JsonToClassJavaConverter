// Example DTO class - User.ts
class User {
    name: string;
    age: number;
    email: string;
    isActive: boolean;
    createdAt: Date;

    constructor(name: string, age: number, email: string, isActive: boolean, createdAt: Date) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }
}
