class ServiceUtilisateur {
    private db = new MySqlConnexion("mysql://localhost/piaf");

    creerCompte(pseudo: string, email: string, type: string): Compte {
        let compte: Compte;
        if (type === "standard") compte = new CompteStandard(pseudo);
        else if (type === "premium") compte = new ComptePremium(pseudo);
        else if (type === "entreprise") compte = new CompteEntreprise(pseudo);
        else throw new Error("Type inconnu");

        this.db.execute(`INSERT INTO comptes VALUES ('${pseudo}', '${email}', '${type}')`);
        const html = `<h1>Bienvenue ${pseudo}</h1><p>Merci de nous rejoindre.</p>`;
        new SmtpClient("smtp.piaf.fr").send(email, "Bienvenue", html);
        return compte;
    }
}

interface Compte {
    publier(texte: string): void;
    envoyerMessagePrive(dest: Compte, texte: string): void;
    acheterPublicite(budget: number): void;
    gererEmployes(): Utilisateur[];
}

class CompteStandard implements Compte {
    constructor(public pseudo: string) {}
    publier(texte: string) { /* ... */ }
    envoyerMessagePrive(dest: Compte, texte: string) { /* ... */ }
    acheterPublicite() { throw new Error("Réservé aux comptes premium"); }
    gererEmployes() { throw new Error("Réservé aux entreprises"); }
}

class CompteEntreprise extends CompteStandard {
    override envoyerMessagePrive() { throw new Error("Les entreprises ne peuvent pas envoyer de MP"); }
    override acheterPublicite(budget: number) { /* ... */ }
    override gererEmployes() { return []; }
}