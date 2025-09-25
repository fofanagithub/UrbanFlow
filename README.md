# UrbanFlow

**Agent IA pour la mobilité urbaine + Hedera Hashgraph**

UrbanFlow est un prototype (MVP) d'agent d'intelligence artificielle qui optimise en temps réel la circulation dans une zone urbaine et journalise ses décisions de façon immuable et vérifiable sur Hedera. Ce dépôt contient la structure projet pensée pour un hackathon : simulateur de capteurs, agent IA, orchestrateur Hedera, backend API, dashboard et scripts de démo.

# Objectif

Démontrer comment une IA peut ajuster dynamiquement les paramètres des feux et de la flotte de transport pour réduire les embouteillages.

Garantir la transparence et l'auditabilité des décisions par l'enregistrement sur Hedera (HCS/HSCS/HTS).

# Fonctionnalités MVP

Simulateur de capteurs (trafic, GPS bus/taxis)

Agent IA heuristique (facile à expliquer en demo) + hook RL pour évolution

Orchestrateur Hedera : envoi de message HCS (hash des décisions) et interaction HSCS/HTS

Backend API (REST) pour contrôles et visualisation

Dashboard React (carte + logs + txId Hedera)

Scripts Docker pour lancer l'ensemble en local
