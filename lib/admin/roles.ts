/* Rôles du back-office : constantes pures, partagées par le serveur et l'interface. */

export type Role = "proprietaire" | "editeur" | "lecteur";

export const ROLES: Role[] = ["proprietaire", "editeur", "lecteur"];

export const LIBELLES_ROLE: Record<Role, string> = {
  proprietaire: "Propriétaire",
  editeur: "Éditeur",
  lecteur: "Lecteur",
};

export const DESCRIPTION_ROLE: Record<Role, string> = {
  proprietaire: "Tous les droits, y compris la gestion des comptes.",
  editeur: "Écrit le contenu, le réseau et les réglages ; consulte les messages.",
  lecteur: "Consulte le back-office sans rien modifier.",
};

export function roleValide(valeur: unknown): Role | null {
  return typeof valeur === "string" && (ROLES as string[]).includes(valeur)
    ? (valeur as Role)
    : null;
}
