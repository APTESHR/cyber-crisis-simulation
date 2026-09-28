# MERIDIAN CYBER DEFENSE OS — Serious Game de Crise Cyber (30 min)

Plateforme interactive d'entraînement et de simulation de crise cyber conçue pour **remplacer et surpasser toute vidéo statique**.

Conforme aux directives de l'ANSSI, de l'ISO 27035 et au déroulé pédagogique officiel du département cybersécurité. 100 % local, hors-ligne, sans dépendance cloud ni API externe.

---

## 🚀 Démarrage Rapide

```bash
npm install
npm run dev
```

L'application s'ouvre sur `http://localhost:5173`.

---

## 🖥️ Les 3 Espaces Synchronisés en Temps Réel

Les différents rôles peuvent être ouverts dans plusieurs onglets ou écrans du même navigateur. La synchronisation est instantanée via `BroadcastChannel` et `localStorage` :

### 1. Espace Entreprise & Opérations (`/simulation`)
Espace réservé aux équipes de réponse à incident (3 à 5 participants par équipe). Reproduit fidèlement une infrastructure d'entreprise complète à travers **7 environnements réalistes** :
- **📧 Webmail Outlook 365** : Boîte de réception, en-têtes RFC822 complets (SPF, DKIM, DMARC, typosquatting), et bac à sable interactif Word avec bandeau jaune et inspecteur de macro VBA.
- **🛡️ Console SOC / SIEM / EDR (CrowdStrike / Splunk)** : Télémétrie en direct avec tags MITRE ATT&CK, arbre d'exécution des processus (`winword.exe` ➔ `powershell.exe` ➔ `beacon.exe`), moniteur de trafic réseau C2, et actions de confinement (quarantine, kill process, dump RAM).
- **🌐 Radar de Topologie Réseau** : Schéma réseau SVG interactif avec animation des flux SMB, faisceau d'infection latérale, et coupure visuelle immédiate des nœuds isolés.
- **📁 Serveur de Fichiers & Crise Rançongiciel** : Partages réseau avec fichiers chiffrés `.locked`, note d'extorsion, **simulateur d'écran de verrouillage plein écran LockBit 3.0** avec compte à rebours, et matrice décisionnelle rançon (ANSSI).
- **🔑 Identités & Accès Microsoft Entra ID** : Sessions actives, détection d'attaque par fatigue MFA (47 push nocturnes à 03h14), et révocations globales.
- **💾 Coffre-Fort de Sauvegardes Veeam (Air-Gap)** : Contrôle d'intégrité SHA256 des snapshots immuables, vérification d'étanchéité, et plan de restauration en bac à sable.
- **📞 Hotline DG, Fuites WhatsApp & Communication** : Appel téléphonique simulé du Directeur Général avec dialogue interactif, groupe WhatsApp avec fuites de captures d'écran, et studio de rédaction du communiqué officiel.

### 2. Projection Salle / Remplacement Vidéo (`/presentation`)
Conçue spécifiquement pour la projection en salle de conférence et remplacer la vidéo :
- Format cinéma 16:9 haute définition avec mode plein écran (`Touche F`).
- Frise chronologique dramatique (09h00 Intro ➔ 09h15 S1 ➔ 09h25 S2 ➔ 09h40 S3 ➔ 09h50 S4 ➔ 10h00 Débriefing).
- Écrans d'alerte **« PAUSE — À VOUS DE DÉCIDER »** avec chronomètre de discussion d'équipe (2 min) et alarme sonore.
- Système de vote interactif de la salle avec affichage des pourcentages en direct et révélation des conséquences.
- Contrôle au clavier pour l'animateur (`Espace`, `Flèches`, `Q`, `F`, `M`).

### 3. Cockpit Formateur & Direction de Crise (`/trainer`)
Outil de régie pour l'animateur de l'exercice :
- Pilotage pas à pas de l'intrigue et chrono global 30:00.
- **Injecteurs d'Incidents en Direct** : Déclencher manuellement l'appel téléphonique du DG, l'écran plein écran LockBit, ou le blocage pare-feu.
- File d'arbitrage des décisions des équipes avec attribution du score en 1 clic.
- Barème officiel (+2, +3, -2, -3).
- **Fiche Formateur A4 Recto/Verso intégrée et imprimable en 1 clic**.
- Export complet de la session en JSON et CSV pour audit.

---

## ⚡ Mode Démonstration Automatique (Auto-Play)

Pour montrer le projet au Chef de Département en 2 minutes chrono :
1. Rendez-vous sur `http://localhost:5173/simulation`.
2. Cliquez sur le bouton **« Démo Automatique »** en haut.
3. Choisissez la vitesse (`1×`, `2×` ou `4×`) puis cliquez sur **« Lancer la Démonstration Automatique »**.
4. Le système rejoue automatiquement toute la chaîne d'attaque : réception de l'e-mail, activation de la macro, alertes EDR, propagation réseau, chiffrement du serveur, appel du DG et débriefing !

---

## 🔊 Moteur Sonore Web Audio API

L'application intègre son propre synthétiseur sonore sans aucun fichier audio externe :
- Alarme d'urgence deux tons pour les incidents critiques.
- Sonnerie téléphonique de bureau réaliste pour l'appel du Directeur Général.
- Retours haptiques / clics cyber et signaux de réussite (+2/+3 pts) ou d'erreur (-2/-3 pts).
- Bouton de coupure du son instantané dans l'en-tête (ou `Touche M`).

---

## 🎯 Les 5 Réflexes Clés (Débriefing)

1. **DÉTECTER** : Repérer les signaux faibles, lenteurs anormales et courriels suspects.
2. **ALERTER** : Signaler immédiatement au support / SOC sans essayer de réparer seul.
3. **ISOLER / CONTENIR** : Déconnecter le réseau (sans éteindre le PC pour préserver la RAM).
4. **ANALYSER / DÉCIDER** : Décision collégiale en cellule de crise (interdiction stricte de payer).
5. **COMMUNIQUER / RESTAURER** : Une seule voix officielle et restauration depuis des sauvegardes saines.
