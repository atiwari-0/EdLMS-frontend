import { graphql } from "@/lib/graphql";
import { ME } from "@/graphql/queries";
type MeResponse = {
  me: {
    id: string;
    name: string;
    email: string;
    role: "TEACHER" | "STUDENT" | "ADMIN";
  };
};

export async function getUserInfo(): Promise<MeResponse["me"] | null> {
  try {
    const data = await graphql<MeResponse>(ME);
    return data.me;
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    return null;
  }
}