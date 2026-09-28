# DOCUMENT MAÎTRE DE PRODUCTION VIDÉO POUR NOTEBOOKLM & IA GÉNÉRATIVE
## Scénario Complet : Anatomie d'une Cyberattaque — Du Phishing au Rançongiciel (Offensive vs. Défensive)
**Auteur :** Antigravity AI & Équipe Cybersécurité  
**Format cible :** Document source pour Google NotebookLM (Audio Overview / Video Briefing) & Pipelines Vidéo IA (Runway Gen-3, OpenAI Sora, Kling AI, Midjourney v6.1, ElevenLabs)  
**Protagoniste Unique :** **Sophie** (Responsable RH, Utilisatrice du poste `HOST-SOPHIE-01`)  
**Direction Artistique :** Hyper-réalisme cinématographique d'entreprise (Acteurs humains réels, environnement corporate authentique, éclairage naturel de bureau, zéro cartoon / zéro style 3D).

---

## 1. DIRECTIVES POUR L'INGESTION DANS NOTEBOOKLM & LLM

> **Instructions pour l'utilisateur de NotebookLM :**
> 1. Ouvrez [NotebookLM](https://notebooklm.google.com/) et créez un nouveau Notebook intitulé **« Simulation Cyberattaque : Phishing & Ransomware (Sophie RH) »**.
> 2. Téléversez ce présent document (`PROJECT_VIDEO_PRODUCTION_NOTEBOOKLM_GUIDE.md`) comme **Source Principale**.
> 3. Dans le panneau de discussion ou pour le **Générateur Audio (Deep Dive / Video Podcast)**, entrez le prompt maître suivant :
>
> *"En te basant rigoureusement sur le document source, génère un dialogue captivant, pédagogique et percutant de deux experts en cybersécurité. Ils décrivent la journée fatidique de Sophie, cadre aux Ressources Humaines, qui reçoit un e-mail de spear-phishing ultra-ciblé. Expliquez pas à pas l'attaque invisible sous le capot (AMSI bypass, C2, dumping LSASS, rebond latéral, double extorsion et chiffrement) tout en mettant en miroir la contre-offensive du SOC (EDR, isolation réseau sans éteindre le PC, révocation Kerberos, capture de RAM, politique DGSSI de non-paiement et restauration immuable WORM). Insistez sur le fait qu'il s'agit d'acteurs humains réels et détaillez la terreur de Sophie quand ses écrans deviennent rouges."*

---

## 2. BIBLE DES PERSONNAGES & DIRECTIVES VISUELLES (GROUNDED IN ASSETS)

Les visuels de cette production doivent respecter strictement les trois photographies de référence fournies :

```
[RÉFÉRENCE PHOTO 1] : media_1790350807292.jpg -> Sophie au travail, concentrée et souriante, état nominal.
[RÉFÉRENCE PHOTO 2] : media_1790350807201.jpg -> Sophie ouvrant le courriel piégé avec bandeau d'alerte urgent.
[RÉFÉRENCE PHOTO 3] : media_1790350807241.jpg -> Sophie horrifiée devant ses 3 écrans devenus rouge sang ("ALL YOUR FILES ARE ENCRYPTED!").
```

### Description Physique et Identité de Sophie
- **Nom complet :** Sophie Renaud
- **Fonction :** Responsable Recrutement et Gestion des Talents (Département RH)
- **Âge apparent :** 36 à 38 ans
- **Caractéristiques physiques :** Teint clair naturel, traits caucasiens/méditerranéens doux mais professionnels, cheveux châtains clairs aux reflets dorés, mi-longs, ondulés, coiffés en demi-queue élégante avec quelques mèches encadrant délicatement le visage. Regard expressif noisette.
- **Tenue vestimentaire :** Blazer de tailleur bleu marine foncé cintré (`navy corporate blazer`), chemisier fluide à motif géométrique/floral discret blanc et bleu, bague simple en argent à la main gauche. Badge ou porte-nom sur le bureau : `SOPHIE RENAUD | HR DEPARTMENT`.
- **Poste de travail :** Bureau en bois clair chaleureux, ordinateur portable Dell professionnel noir ouvert, flanqué de deux grands moniteurs 27 pouces Dell UltraSharp, clavier ergonomique, souris optique, tasse de café personnalisée avec logo `"HR"`, chemises cartonnées beiges de dossiers du personnel sur le côté gauche, classeurs de recrutement en arrière-plan.
- **Décor :** Plateau de bureau moderne, baies vitrées lumineuses avec vue urbaine, cloisons vitrées d'atelier avec lettrage dépoli `"HR OFFICE | RECRUITMENT CONFIDENTIAL"`, collègues en arrière-plan en tenue de bureau floutés avec élégance (profondeur de champ cinématographique f/2.0).

---

## 3. INTRODUCTION PÉDAGOGIQUE : PHISHING & RANÇONGICIEL

### A. Qu'est-ce que le Spear-Phishing (Harponnage) ?
Contrairement au spam de masse générique, le **spear-phishing** est une attaque chirurgicale et préparée. Les cybercriminels étudient l'entreprise sur LinkedIn, identifient les organigrammes, et ciblent spécifiquement des collaborateurs détenant des accès stratégiques (comme les RH ou la Comptabilité). 
- **Le levier psychologique :** L'urgence (« *à régulariser avant 12h00* »), l'autorité (« *Direction des Ressources Humaines / Support IT* ») et l'intérêt personnel (« *Note de revalorisation salariale 2026* »).
- **Le vecteur technique :** Un document bureautique apparemment légitime (`.docm`) contenant une macro VBA (Visual Basic for Applications) obfusquée conçue pour contourner les contrôles de sécurité initiaux.

### B. L'Évolution du Rançongiciel Moderne : La Double Extorsion
Le rançongiciel d'aujourd'hui ne se contente plus de bloquer les postes :
1. **L'Intrusion Silencieuse :** L'attaquant s'installe, désactive la détection antivirus en mémoire (AMSI Bypass), et contacte un serveur de Command & Control (C2).
2. **Le Vol des Privilèges :** Il pille les identifiants d'administration dans la mémoire vive (`lsass.exe`) pour se déplacer de machine en machine.
3. **L'Exfiltration Furtive (Double Extorsion) :** Avant même de bloquer un seul fichier, il vole des gigaoctets de données confidentielles (salaires, contrats, brevets). Si l'entreprise refuse de payer, les criminels menacent de tout publier sur le Dark Web.
4. **Le Sabotage et Chiffrement :** Il supprime les clichés instantanés locaux (`vssadmin`), coupe les sauvegardes accessibles, et déclenche le chiffrement AES-256 avec la redoutable note de rançon demandant plusieurs Bitcoins.

---

## 4. MATRICE OPÉRATIONNELLE SYNCHRONISÉE (ATTAQUE VS. DÉFENSE)

| Phase | Étape Attaque (Offensive Reality) | Étape Défense (SecOps & SOC) | Télémétrie & Preuve Clé | Délais d'Or (SLA) |
|---|---|---|---|---|
| **01** | **Accès Initial (T1566.001)**<br>Envoi du mail piégé `Note_Salaires_2026.docm` usurpant la direction RH vers `sophie.rh@entreprise.com`. | **Triage L1 & Purge Globale**<br>Détection de l'anomalie de domaine par la passerelle de messagerie; extraction du hash SHA-256 et purge globale sur les 1 200 boîtes de l'entreprise. | `swaks --to rh@entreprise.com`<br>Hash SHA-256 : `e3b0c44298fc...`<br>Message Trace : 1 seule boîte touchée (Sophie). | **< 15 min** |
| **02** | **Exécution & Évasion (T1059 / T1562)**<br>Sophie clique sur « Activer le contenu ». La macro lance un PowerShell masqué en Base64 et patche AMSI en mémoire vive pour masquer le script. | **Détection Comportementale EDR**<br>Les capteurs EDR interceptent la parenté anormale `WINWORD.EXE -> cmd.exe -> powershell.exe`. Alerte critique MITRE 9.8/10. | `powershell.exe -W Hidden -Enc...`<br>`[Ref].Assembly.GetType('...AmsiUtils')`<br>Alerte EDR : Arborescence anormale. | **< 1 heure** |
| **03** | **Commande & Contrôle (T1071.001)**<br>Ouverture d'un tunnel chiffré sortant HTTPS (Port 443) vers le serveur pirate `185.22.14.89` pour session interactive sur `HOST-SOPHIE-01`. | **Isolement Réseau & Drop Pare-Feu**<br>Isolement logique EDR immédiat du poste de Sophie tout en le **laissant sous tension** pour préserver la RAM. Blocage IP sur le pare-feu NGFW. | Session interactive C2 active.<br>Consigne d'or : Ne pas éteindre le PC.<br>Règle pare-feu : DROP 185.22.14.89:443. | **< 1-2 heures** |
| **04** | **Vol d'Identifiants (T1003.001)**<br>Injection dans le processus système `lsass.exe` pour dérober le condensat NTLM et les tickets Kerberos de l'administrateur du domaine (`DA_admin`). | **Révocation IAM Globale**<br>Double réinitialisation du compte Active Directory `KRBTGT`, invalidation de 100% des tickets Kerberos TGT et sessions OAuth, reset mot de passe administrateur et MFA obligatoire. | Extraction hash : `8846f7eaee8fb117...`<br>IAM : Double reset KRBTGT.<br>Verrouillage des accès à privilèges. | **< 2 heures** |
| **05** | **Déplacement Latéral (T1550.002)**<br>Technique Pass-the-Hash via SMB (Port 445) et WMI/RPC pour tenter d'infecter le serveur central de fichiers `FS-CORP-01`. | **Micro-segmentation & Détection NDR**<br>La sonde réseau (NDR) repère le balayage anormal entre VLAN Postes et VLAN Serveurs. Coupure dynamique des flux inter-VLAN. | Requêtes SMB anormales sur port 445.<br>Blocage inter-VLAN engagé.<br>Le serveur de production est préservé. | **< 2-3 heures** |
| **06** | **Exfiltration Furtive (T1567.002)**<br>Double extorsion : compression et chiffrement des dossiers stratégiques (`D:\RH`, `D:\Finances`) et envoi de 42 Go vers un stockage cloud pirate. | **Rupture de Fuite NDR / SWG**<br>Détection d'un pic volumétrique anormal d'upload vers l'extérieur. Activation du coupe-circuit (Killswitch SWG) et bornage de l'impact. | 42 Go d'upload interceptés.<br>Liaisons sortantes sectionnées net.<br>Audit d'exposition des données initié. | **< 3 heures** |
| **07** | **Sabotage & Chiffrement (T1486 / T1490)**<br>Suppression des clichés instantanés (`vssadmin delete shadows`), arrêt des bases de données, chiffrement en `.locked` et pose de la note de rançon (2 BTC). | **Triage DFIR, Crise DGSSI & Restauration**<br>Acquisition de la RAM et du disque ($MFT). Activation cellule de crise, refus formel de payer (doctrine DGSSI / maCERT), notification CNDP 72h, ré-imageage propre et restauration depuis sauvegarde immuable WORM. | Écrans rouges sur le poste.<br>Note `README_LOCKED_RESTORE.txt`.<br>Notification DGSSI/maCERT effectuée.<br>Restauration étanche depuis NAS Veeam. | **< 24-48 heures** |

---

## 5. DÉCOUPAGE SCÉNARISTIQUE COMPLET (SCRIPT VIDÉO IMAGE PAR IMAGE)

### SCÈNE 01 : LA MATINÉE ORDINAIRE (09h05)
- **Plan Visuel :** Plan moyen cinématographique (inspiré de `media_1790350807292.jpg`).
- **Description Visuelle :** Sophie est assise à son bureau ergonomique. Les reflets matinaux illuminent le bureau vitré des RH. Elle tape sur son ordinateur portable avec un léger sourire serein. Sur ses deux grands écrans Dell, on aperçoit l'interface de gestion RH des candidatures et le planning de paie. En arrière-plan, la vie d'entreprise suit son cours : deux collègues discutent calmement avec des dossiers près de la baie vitrée.
- **Voix Off (Narration) :**  
  *« Mardi matin, 9h05 au siège de l'entreprise. Sophie, responsable des Ressources Humaines, entame sa journée de travail. Le trimestre touche à sa fin, et les dossiers de paie et de recrutement s'accumulent. Tout est calme. Mais dans l'ombre du cyberespace, une bombe à retardement vient d'être armée. »*
- **Ambiance Sonore :** Bruitages de bureau étouffés, frappes de touches légères, cliquetis de tasse à café, musique d'ambiance corporate feutrée et apaisante.

---

### SCÈNE 02 : LE PIÈGE DU SPEAR-PHISHING (09h14)
- **Plan Visuel :** Gros plan sur l'écran d'ordinateur de Sophie puis contre-champ sur son visage attentif (inspiré de `media_1790350807201.jpg`).
- **Description Visuelle :** Une notification Outlook surgit en bas de l'écran avec un triangle d'avertissement rouge. Sophie clique dessus. L'e-mail provient faussement de `direction-rh@plateforme-paie.online` avec pour objet : *« ⚠️ URGENT : Note de révision et synchronisation des salaires 2026 »*. Le texte est autoritaire, formel et pressant. Une pièce jointe Word nommée `Note_Salaires_2026.docm` est attachée. Sophie fronce légèrement les sourcils, intriguée et sous pression du délai de midi.
- **Voix Off (Narration) :**  
  *« À 9h14, un courriel d'une précision diabolique arrive dans la boîte de Sophie. Ce n'est pas un spam grossier, c'est du spear-phishing chirurgical. L'expéditeur usurpe le portail de paie officiel, invoque une directive de la Direction Générale et brandit une date limite : midi. Pour consulter la note, Sophie doit ouvrir la pièce jointe. »*
- **Ambiance Sonore :** Notification sonore Windows Outlook, montée progressive d'une pulsation de basse grave et oppressante.

---

### SCÈNE 03 : LE CLIC FATIDIQUE & LE BANDEAU JAUNE (09h16)
- **Plan Visuel :** Plan serré sur les mains de Sophie au-dessus du clavier et zoom avant sur le bandeau supérieur de Microsoft Word.
- **Description Visuelle :** Le document Word s'ouvre, mais son contenu apparaît flouté avec un faux message système : *« Contenu protégé par la politique de sécurité interne. Veuillez cliquer sur Activer le contenu pour synchroniser votre profil »*. Le bandeau jaune officiel de Microsoft Word est visible en haut. La souris de Sophie se déplace et clique sur le bouton jaune `[Activer le contenu]`.
- **Voix Off (Narration) :**  
  *« Le piège se referme. Face au bandeau jaune de sécurité de Microsoft Office, Sophie clique sur 'Activer le contenu'. Pour elle, rien ne s'est passé : le document reste anodin. Mais en réalité, le code malveillant vient de s'éveiller. »*
- **Ambiance Sonore :** Le clic de souris résonne avec un effet de réverbération métallique. La musique s'arrête brusquement, laissant place à une nappe sonore sourde et angoissante.

---

### SCÈNE 04 : SOUS LE CAPOT — L'INVASION INVISIBLE (09h17 - 09h21)
- **Plan Visuel :** Transition visuelle dynamique : la caméra plonge à travers les circuits de la machine vers un écran noir de terminal hacker (code vert et blanc défilant) et vers l'écran d'analyse du SOC.
- **Description Visuelle :**
  1. La macro Word engendre un processus `powershell.exe` masqué par l'argument `-W Hidden -Enc`.
  2. En une fraction de seconde, le script injecte en mémoire vive un patch contournant l'interface **AMSI (Antimalware Scan Interface)** pour neutraliser la détection locale de Windows Defender.
  3. Une connexion chiffrée sortante HTTPS (Port 443) est établie vers l'adresse IP `185.22.14.89` située en Bulgarie. Le pirate dispose désormais d'un accès interactif à distance complet sur `HOST-SOPHIE-01`.
- **Voix Off (Narration) :**  
  *« Sous le capot, l'attaque se déploie à la vitesse de la lumière. La macro déclenche un interpréteur PowerShell invisible. Première priorité de l'attaquant : désactiver les défenses en mémoire. Grâce à une altération de l'AMSI, l'antivirus local est aveuglé. Le malware ouvre alors un tunnel chiffré vers un serveur de Command and Control à Sofia. Les cybercriminels sont désormais assis virtuellement au bureau de Sophie. »*
- **Ambiance Sonore :** Pulsation électronique rapide, sons de flux de données numériques, bips de connexion réseau chiffrée.

---

### SCÈNE 05 : LA CONTRE-ATTAQUE DU SOC & L'ISOLEMENT SANS ÉTEINDRE (09h22)
- **Plan Visuel :** Salle de contrôle du SOC (Security Operations Center). Grand écran mural affichant la cartographie réseau avec des alertes orange et rouge vif. Deux analystes surveillent leurs consoles SIEM et EDR.
- **Description Visuelle :** L'analyste SOC L2 (Sara) voit une alerte de sévérité 9.8 clignoter : `EDR Detection Alert : Anomalous execution tree (WINWORD.EXE -> cmd.exe -> powershell.exe)`. Sans hésiter, Sara clique sur le bouton d'action d'urgence de la console EDR : `[ISOLER L'HÔTE DU RÉSEAU]`. Une notification clignote sur sa console : *« Machine isolée logiquement. Consigne critique : maintenir sous tension pour préserver la RAM »*. Simultanément, une règle est poussée au pare-feu périmétrique pour bannir l'IP du C2.
- **Voix Off (Narration) :**  
  *« Mais l'entreprise n'est pas sans défense. Au centre des opérations de sécurité, les sondes EDR détectent immédiatement l'arbre de processus suspect : Word ne devrait jamais lancer PowerShell. Le réflexe est instantané : l'ordinateur de Sophie est isolé du réseau en un clic. Et la règle absolue est respectée : interdiction formelle d'éteindre le PC ! Car éteindre la machine détruirait la mémoire vive, qui contient les clés de déchiffrement et les traces indispensables aux enquêteurs. »*
- **Ambiance Sonore :** Sons d'alerte technologique maîtrisée, frappes rapides sur clavier mécanique, voix calmes et professionnelles des analystes en arrière-plan.

---

### SCÈNE 06 : L'ESCALADE PIRATE — LSASS, REBOND LATÉRAL & DOUBLE EXTORSION (09h25 - 09h35)
- **Plan Visuel :** Écran partagé dynamique : à gauche, la console pirate lançant les modules offensifs ; à droite, le radar réseau montrant les flux laser de tentative de propagation.
- **Description Visuelle :**
  1. **Vol d'identifiants :** Le module pirate attaque le processus `lsass.exe` et réussit à extraire le condensat NTLM du compte administrateur `DA_admin`.
  2. **Réponse IAM :** Les administrateurs de domaine réagissent immédiatement en déclenchant la double réinitialisation du compte `KRBTGT` de l'Active Directory, révoquant d'un coup 100% des tickets Kerberos de l'entreprise.
  3. **Rebond SMB :** Le ver tente d'emprunter le port SMB 445 vers le serveur de fichiers central, mais la micro-segmentation du réseau NDR bloque la transition inter-VLAN.
  4. **Exfiltration :** Les pirates ont cependant eu le temps de commencer à aspirer 42 Go de données sensibles vers un serveur cloud. Le proxy SWG tranche net la connexion sortante pour borner la fuite.
- **Voix Off (Narration) :**  
  *« Acculés par l'isolement, les attaquants tentent le tout pour le tout. Ils pillent la mémoire LSASS pour dérober les hashs d'administration et tentent de bondir vers le serveur de fichiers via le port SMB 445. Mais la micro-segmentation réseau dresse un mur d'acier entre les VLANs. Les attaquants tentent alors la double extorsion en exfiltrant 42 gigaoctets de documents RH. Les sondes de flux coupent la liaison sortante. La propagation générale est stoppée, mais sur la machine de Sophie, la phase finale de destruction commence. »*
- **Ambiance Sonore :** Musique rythmée et dramatique, alarmes de réseau étouffées, sons de coupure électrique nette marquant la rupture du lien.

---

### SCÈNE 07 : LA DÉTONATION & LE CHOC DES ÉCRANS ROUGES (09h40)
- **Plan Visuel :** Plan large se resserrant brutalement sur Sophie (conformité exacte avec `media_1790350807241.jpg`).
- **Description Visuelle :**
  - Sur le portable et les deux écrans Dell de Sophie, l'affichage vacille. La souris ne répond plus.
  - Brutalement, les 3 écrans deviennent **entièrement rouge sang**.
  - En lettres blanches et jaunes géantes s'affiche la note de rançon :
    ```
    ALL YOUR FILES ARE ENCRYPTED!
    Your HR files, databases, and private documents have been locked with AES-256 encryption.
    TIME REMAINING: 47:59:58
    SEND 2 BITCOIN TO: [Adresse Portefeuille Crypto]
    ```
  - Sophie pousse un hoquet de stupeur, bouche entrouverte, le regard écarquillé de terreur, la main droite figée sur son clavier.
  - En arrière-plan, ses collègues se lèvent, stupéfaits, découvrant que l'imprimante réseau crache également la note de rançon.
- **Voix Off (Narration) :**  
  *« 9h40. La charge destructive du rançongiciel explose sur le poste de travail. Les clichés instantanés de sauvegarde locale sont effacés. En quelques secondes, les dossiers du personnel sont renommés en extensions chiffrées indéchiffrables. Les écrans de Sophie virent au rouge cramoisi. Le compte à rebours s'enclenche : 48 heures pour verser 2 Bitcoins, sous peine de voir les dossiers confidentiels des employés diffusés sur le Dark Web. La terreur s'empare de l'étage. »*
- **Ambiance Sonore :** Grésillement numérique brutal, son lourd d'explosion étouffée, bip lancinant d'un compte à rebours de montre, respiration saccadée de Sophie.

---

### SCÈNE 08 : LA CELLULE DE CRISE & LA DOCTRINE DGSSI (10h00)
- **Plan Visuel :** Salle du conseil transformée en cellule de crise. Le Directeur Général, le RSSI, la Directrice Juridique et la DPO sont réunis autour d'une grande table avec des ordinateurs sécurisés hors-réseau.
- **Description Visuelle :** Le Directeur Général demande avec gravité : *« Doit-on payer la rançon pour récupérer les fichiers ? »*. Le RSSI secoue fermement la tête et présente le rapport :
  1. **Interdiction formelle de payer la rançon :** Conforme aux directives de la DGSSI et du maCERT (payer finance le crime, n'offre aucune garantie de clé valide et expose à des ré-attaques).
  2. **Notification légale CNDP dans les 72 heures :** La fuite potentielle de données à caractère personnel RH est documentée en toute transparence.
  3. **Restauration Immuable :** Le serveur de sauvegarde `NAS-VEEAM-AIRGAP` situé sur un VLAN étanche isolé (technologie WORM) est certifié 100% sain et intact.
- **Voix Off (Narration) :**  
  *« Dans la salle de crise, la panique n'a pas sa place. Faut-il céder au chantage ? La réponse du RSSI est catégorique : NON. Payer la rançon, c'est financer le terrorisme numérique et s'exposer à 50% de risques de ne jamais revoir ses fichiers. L'entreprise applique scrupuleusement la doctrine de la DGSSI et déclare l'incident à la CNDP. Pendant ce temps, les experts du DFIR prélèvent l'image mémoire pour l'enquête judiciaire, tandis que les équipes d'infrastructure préparent la reconstruction. »*
- **Ambiance Sonore :** Ambiance feutrée, voix posées d'experts, sonorité d'horloge de table, musique orchestrale inspirante et déterminée.

---

### SCÈNE 09 : LA RENAISSANCE & LES ENSEIGNEMENTS (15h30)
- **Plan Visuel :** Retour sur le poste de Sophie, ré-imageé avec un fond d'écran d'entreprise propre. Sophie discute chaleureusement avec le RSSI et l'analyste SOC qui lui remettent un guide de sensibilisation.
- **Description Visuelle :** Le poste de travail a été intégralement reformaté et restauré à partir d'une image certifiée saine. Les fichiers de paie ont été réinjectés depuis les sauvegardes immuables sans perte. Sophie sourit avec soulagement, reconnaissante envers l'équipe de défense.
- **Voix Off (Narration) :**  
  *« 15h30. Grâce à la rapidité d'isolement du SOC, à la micro-segmentation et aux sauvegardes immuables hors-ligne, pas un centime n'a été versé aux criminels. L'activité de l'entreprise reprend normalement. Sophie n'est pas blâmée : elle devient la première ambassadrice de la cybersécurité dans l'organisation. Car la cybersécurité n'est pas seulement l'affaire d'outils informatiques : c'est un bouclier collectif fondé sur la vigilance humaine et des réflexes partagés. »*
- **Ambiance Sonore :** Musique lumineuse, cordes ascendantes chaleureuses, soupir de soulagement, sons de travail d'entreprise retrouvés.

---

## 6. PROMPTS D'INGÉNIERIE CLÉ EN MAIN POUR GÉNÉRATEURS VIDÉO & IMAGES IA

### A. Midjourney v6.1 (Images Phares Hyper-Réalistes)

#### Prompt 1 : Sophie au travail (Nominal)
```text
/imagine prompt: Cinematic medium shot of a 37-year-old professional corporate woman named Sophie, natural European features, hazel brown eyes, light brown wavy hair tied in an elegant half-up corporate hairstyle, wearing a tailored navy blue blazer over a discreet silk patterned blouse. She is sitting at an executive wooden office desk typing calmly on a slim black laptop. Flanked by two modern 27-inch Dell UltraSharp monitors displaying clean corporate HR management software. Ceramic white coffee mug with small "HR" logo, organized employee dossiers. Modern bright office background with glass partitions with frosted text "HR OFFICE", soft cinematic sunlight streaming through large floor-to-ceiling windows, subtle depth of field, shot on 35mm Arri Alexa, photorealistic, 8k resolution, ultra-detailed corporate photography --ar 16:9 --style raw --v 6.1
```

#### Prompt 2 : Sophie découvrant le mail de phishing (Tension)
```text
/imagine prompt: Close cinematic eye-level shot of a 37-year-old corporate woman named Sophie, navy blazer, looking intensely and concerned at her laptop screen in a modern sunlit corporate office. Her laptop screen shows a corporate email client with an urgent spear-phishing email and a bright yellow warning banner asking to enable macros. Her facial expression shows mild skepticism and intense concentration, leaning forward over her wooden desk. Dual external monitors on the desk, high-end office environment, photorealistic facial pores, realistic skin texture, shallow depth of field, dramatic cinematic corporate lighting, 8k --ar 16:9 --style raw --v 6.1
```

#### Prompt 3 : L'écran rouge de rançongiciel & Le choc (Le climax)
```text
/imagine prompt: Dramatic cinematic wide shot of a 37-year-old corporate HR woman named Sophie in a tailored navy blazer, recoiling in sheer horror and shock in her modern corporate office. Her laptop screen and two huge desktop monitors have completely turned glaring crimson red with large bold white and yellow text proclaiming "ALL YOUR FILES ARE ENCRYPTED! 2 BITCOIN TO... TIME REMAINING: 47:59:58". Her hand is frozen above the keyboard, her mouth parted in disbelief, eyes wide with terror, red screen glow reflecting intensely off her face and blazer. In the background, out-of-focus office colleagues are standing up in confusion. 35mm anamorphic lens, Kodak Vision3 cinematic color science, hyper-realistic, photorealistic masterpiece, 8k --ar 16:9 --style raw --v 6.1
```

---

### B. Runway Gen-3 Alpha / Kling AI (Prompts de Génération Vidéo)

#### Clip 1 : Le Clic de Sophie
```text
Text-to-Video: Cinematic slow push-in shot of a professional woman in her late 30s with light brunette wavy hair and a dark navy blazer, seated in a sunlit corporate office. Her hand gently moves the computer mouse and clicks on a yellow button on her laptop screen. Camera slowly tracks from her focused face to the laptop screen, realistic lighting, authentic office ambiance, 4k 24fps.
Camera motion: Push in, smooth, subtle handheld feel.
```

#### Clip 2 : Le Basculement Écran Rouge
```text
Text-to-Video: Shocking cinematic revelation shot. A professional woman in a navy suit suddenly gasps and leans back in terror as all three computer monitors on her wooden desk instantly turn bright crimson red with aggressive ransomware warning typography. The vibrant red glow illuminates her alarmed face in the modern office. Background colleagues turn heads in panic. Realistic motion blur, cinema verite style, 4k.
Camera motion: Fast slight dolly zoom (Vertigo effect), locked on the protagonist's terrified expression.
```

#### Clip 3 : La Salle de Crise
```text
Text-to-Video: Slow cinematic pan across an executive boardroom. A group of corporate executives and cybersecurity analysts in suits and shirts are gathered around a table with laptops and network topology charts. Serious determined expressions, warm cinematic overhead lighting, city skyline visible through the window, premium Netflix documentary aesthetic, 4k 24fps.
Camera motion: Smooth horizontal tracking pan left to right.
```

---

### C. Directives Vocales pour ElevenLabs (Voice Design & Direction)

- **Narrateur Principal (Voix Masculine ou Féminine Posée) :**
  - **Profil :** Voix grave, chaleureuse, posée, style documentaire d'investigation ou masterclass d'ingénierie (ex : type *"George"* ou *"Rachel"*).
  - **Paramètres :** Stability = `0.65`, Clarity / Similarity Boost = `0.85`, Style Exaggeration = `0.15`.
  - **Rythme :** Modéré (environ 135 mots par minute), avec des pauses marquées avant les révélations techniques (ex : *« Et la règle d'or est appliquée : ne jamais éteindre la machine. »*).

---

## 7. RAPPEL DES 5 RÉFLEXES D'OR POUR TOUT COLLABORATEUR

En conclusion de la vidéo, afficher ces cinq règles fondamentales :

```
┌────────────────────────────────────────────────────────────────────────┐
│               LES 5 RÉFLEXES DU BOUCLIER HUMAIN EN ENTREPRISE           │
├────────────────────────────────────────────────────────────────────────┤
│ 1. STOPPER L'URGENCE      : Aucune procédure légitime n'exige un clic  │
│                             irréfléchi sous pression de temps.         │
│ 2. RECONNAÎTRE LE PIÈGE    : Ne JAMAIS activer les macros Word/Excel    │
│                             sur un document provenant d'Internet.      │
│ 3. ALERTER LE SUPPORT     : Signaler immédiatement au SOC ou à l'IT    │
│                             dès le moindre comportement anormal du PC. │
│ 4. ISOLER SANS ÉTEINDRE   : Débrancher le câble réseau ou couper le    │
│                             Wi-Fi, mais laisser l'ordinateur allumé    │
│                             pour préserver la mémoire vive (RAM).      │
│ 5. ZÉRO PAIEMENT          : Ne jamais payer les criminels. La seule    │
│                             vraie sécurité repose sur des sauvegardes  │
│                             immuables et étanches (WORM).              │
└────────────────────────────────────────────────────────────────────────┘
```

---
*Fin du document maître de production. Document prêt pour ingestion immédiate dans NotebookLM et outils de génération IA.*
