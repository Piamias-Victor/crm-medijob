# Gmail web comme compose par défaut

Décision V2 : `<EmailButton>` ouvre **Gmail web** (`https://mail.google.com/mail/?view=cm`) dans un nouvel onglet par défaut (`composeClient="gmail"`).

`mailto:` reste disponible via `composeClient="mailto"` pour un client mail natif.

Motivation : les recruteurs MediJob utilisent Gmail ; le flux `mailto:` dépend du handler OS/navigateur et est moins prévisible en démo et en production.

ActivityLog EMAIL reste optionnel et manuel après retour focus ou délai court.
