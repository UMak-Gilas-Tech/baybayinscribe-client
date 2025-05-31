import { create } from "zustand";
import { authClient } from "../lib/auth-client";

export enum Role {
  user = "user",
  admin = "admin",
}

export type RoleStore = {
  getCurrentUserRole: () => Promise<Role | undefined>;
};

export const useRoleStore = create<RoleStore>(() => ({
  getCurrentUserRole: async () => {
    const session = await authClient.getSession();
    if (!session || !session.data) {
      return undefined;
    }
    return session.data.user.role as unknown as Role;
  },
}));
