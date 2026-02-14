import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type FamilyMember = Principal;
export interface ChatMessage {
    id: MessageId;
    content: string;
    sender: Principal;
    timestamp: Time;
}
export type Time = bigint;
export type MessageId = number;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMember(member: FamilyMember): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    fetchMessages(offset: bigint, limit: bigint): Promise<Array<ChatMessage>>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    isMember(): Promise<boolean>;
    listMembers(): Promise<Array<FamilyMember>>;
    postMessage(content: string): Promise<MessageId>;
    removeMember(member: FamilyMember): Promise<void>;
}
