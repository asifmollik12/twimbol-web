/**
 * Role helpers.
 *
 * The auth store holds a *profile* that wraps the user (`profile.user.user_group`),
 * but some callers reach for `profile.user_group` instead and silently get
 * nothing. Reading roles through here keeps that shape in one place, and
 * tolerates `user` being null on a hard refresh before fetchProfile resolves.
 *
 * These are for showing/hiding UI only. Never treat them as security: the store
 * is persisted to localStorage, so anyone can edit their own groups. The API
 * enforces the real thing.
 */

export function getUserGroups(profile) {
  if (!profile) return [];
  return profile.user?.user_group || profile.user_group || [];
}

export const isAdmin = (profile) => getUserGroups(profile).includes("admin");
export const isCreator = (profile) => getUserGroups(profile).includes("creator");

export const primaryRole = (profile) => {
  const groups = getUserGroups(profile);
  if (groups.includes("admin")) return "admin";
  if (groups.includes("creator")) return "creator";
  return "visitor";
};
