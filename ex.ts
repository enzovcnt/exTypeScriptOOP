
interface Publiant { publier(texte: string): void; }
interface Messagerie { envoyerMessagePrive(dest: Messagerie, texte: string): void; }
interface Annonceur { acheterPublicite(budget: number): void; }
interface Employeur { gererEmployes(): Utilisateur[]; }

type TypeCompte = "standard" | "premium" | "entreprise";

abstract class Compte { constructor(public readonly pseudo: string) {} }

class CompteStandard extends Compte implements Publiant, Messagerie {
    publier(texte: string) { /* ... */ }
    envoyerMessagePrive(dest: Messagerie, texte: string) { /* ... */ }
}

class ComptePremium extends Compte implements Publiant, Messagerie, Annonceur {
    publier(texte: string) { /* ... */ }
    envoyerMessagePrive(dest: Messagerie, texte: string) { /* ... */ }
    acheterPublicite(budget: number) { /* ... */ }
}
class CompteEntreprise extends Compte implements Publiant, Annonceur, Employeur {
    publier(texte: string) { /* ... */ }
    acheterPublicite(budget: number) { /* ... */ }
    gererEmployes(): Utilisateur[] { return []; }
}
const fabriques: Record<TypeCompte, (pseudo: string) => Compte> = {
    standard: p => new CompteStandard(p),
    premium: p => new ComptePremium(p),
    entreprise: p => new CompteEntreprise(p),
};
class ServiceUtilisateur {
    private db = new MySqlConnexion("mysql://localhost/piaf");

    creerCompte(pseudo: string, email: string, type: TypeCompte) {
        const compte = fabriques[type](pseudo);
        this.db.execute(`INSERT INTO comptes VALUES ('${pseudo}', '${email}', '${type}')`);
        const html = `<h1>Bienvenue ${pseudo}</h1><p>Merci de nous rejoindre.</p>`;
        new SmtpClient("smtp.piaf.fr").send(email, "Bienvenue", html);
        return compte;
    }
}