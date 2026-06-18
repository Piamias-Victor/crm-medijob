# Double ActivityLog pour les emails candidat en contexte mission

Lorsqu'un recruteur contacte un candidat depuis le matching IA (contexte Mission), l'interaction doit apparaître à la fois dans la timeline du Candidate et dans celle de la Mission.

Décision : chaque email envoyé depuis un contexte mission crée deux ActivityLog distincts (`type: EMAIL`) — un rattaché au Candidate, un rattaché à la Mission. Pas de double saisie manuelle : création automatique à l'envoi Resend.
