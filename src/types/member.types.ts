export interface Member {
  _id: string;
  email: string;
  role: "owner" | "member";
}